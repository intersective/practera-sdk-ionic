import { Component, ViewChild } from '@angular/core';
import {
  NavParams,
  NavController,
  Navbar,
  LoadingController,
  ModalController,
  AlertController,
  Events
} from 'ionic-angular';
import { confirmMessages, errMessages, loadingMessages } from '../../app/messages';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
//services
import { AssessmentService } from '../../services/assessment.service';
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
import { SubmissionService } from '../../services/submission.service';
import { TranslationService } from '../../shared/translation/translation.service';
// pages
import { AssessmentsGroupPage } from './group/assessments-group.page'
import { ItemsPopupPage } from './popup/items-popup.page';
// import { TabsPage } from '../../pages/tabs/tabs.page';
import { ActivitiesListPage } from '../activities/list/list.page';

@Component({
  selector: 'assessments-page',
  templateUrl: './assessments.html'
})
export class AssessmentsPage {
  @ViewChild(Navbar) navbar: Navbar;

  activity: any = {};
  answers: any = {};

  assessment: any = {};
  assessmentGroups: any = [];
  assessmentQuestions: any = [];
  allowSubmit: boolean = false;
  submissions: any = [];
  getInitialItems: any = this.cacheService.getLocalObject('initialItems');
  getCharacterID: any = this.cacheService.getLocal('character_id');
  gotNewItems: boolean = false;
  isEventSubmission: boolean = false;
  initialItemsCount: any = {};
  newItemsCount: any = {};
  newItemsData: any = [];
  totalItems: any = [];
  allItemsData: any = [];
  combinedItems: any = [];
  noItems: boolean = null;
  outputData: any = [];
  public loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  submissionUpdated: boolean = false; // event listener flag
  // confirm message variables
  private discardConfirmMessage = confirmMessages.Assessments.DiscardChanges.discard;
  private submitConfirmMessage = confirmMessages.Assessments.SubmitConfirmation.confirm;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private assessmentService: AssessmentService,
    private cacheService: CacheService,
    private gameService: GameService,
    private submissionService: SubmissionService,
    private translationService: TranslationService,
    public events: Events
  ) {
    this.activity = this.navParams.get('activity');
    if (!this.activity) {
      throw "Fatal Error: Activity not available";
    }
  }

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.loadQuestions()
      .then(() => {
        loader.dismiss();
      }).catch(err => {
        console.log(err);
        loader.dismiss();
      });
    });
  }

  /**
   * track if this page need to download assessment manually (extra load)
   */
  traceAssessmentProgress() {
    this.events.subscribe('assessment:changes', (submissionUpdated) => {
      this.submissionUpdated = true;
    });
  }

  /**
   * @description mapping assessments and submissions
   * @param {Object} submissions submissions
   * @param {Object} assessments assessments
   * @returns {Array} objects of compiled assessment + submissions
   */
  mapSubmissionsToAssessment(submissions, assessmentsBatch) {
    let result = [];

    _.forEach(assessmentsBatch, (batch, i) => {

      let assessmentResult = [];
      _.forEach(batch, (assessment, j) => {
        // normalised
        let normalised = this.assessmentService.normalise(assessment);

        // groups
        let assessmentGroupResult = [];
        _.forEach(normalised.AssessmentGroup, assessmentGroup => {
          // questions
          let questionsResult = [];
          let submissionResult : any = {};
          _.forEach(assessmentGroup.questions, question => {
            // force answers as null by default (for checkings)
            let questionResult : any = {
              answer: null,
              reviewerAnswer: null
            };

            // find submission
            _.forEach(submissions, (submission) => {
              // attach existing submission to assessment group it belongs to
              if (assessmentGroup.assessment_id === submission.assessment_id) {
                submissionResult = submission;
              }

              // find user answer
              _.forEach(submission.answer, (answer) => {
                if (answer.assessment_question_id === question.question_id) {
                  questionResult.answer = answer;
                }
              });

              // find reviewer feedback
              _.forEach(submission.review, (reviewerAnswer) => {
                if (reviewerAnswer.assessment_question_id === question.question_id) {
                  questionResult.reviewerAnswer = reviewerAnswer;
                }
              });
            });

            // set assessmentGroup as accessible (submitter has no permission to view)
            if (this.isAccessibleBySubmitter(question, submissionResult.status)) {
              assessmentGroup.accessible = true;
              questionsResult.push(Object.assign(question, questionResult));
            }
          });

          let summaries = this.assessmentService.getSummaries(questionsResult);
          if (assessmentGroup.accessible) {
            assessmentGroupResult.push(Object.assign(assessmentGroup, {
              questions: questionsResult,
              submission: submissionResult,
              totalRequiredQuestions: summaries.totalRequiredQuestions,
              answeredQuestions: summaries.answeredQuestions,
              reviewerFeedback: summaries.reviewerFeedback,
              status: this.assessmentService.getStatus(questionsResult, submissionResult)
            }));
          }
        });

        normalised.AssessmentGroup = assessmentGroupResult;
        assessmentResult.push(normalised);
      });

      result.push(assessmentResult);
    });

    return result;
  }

  // filter question by condition (submitter cannot view reviewer question before it is published/reviewed)
  isAccessibleBySubmitter(question, submissionStatus: string) {
    let accessible = true;
    let submitterAllowed = false;

    if (question.audience && question.audience.indexOf('submitter') !== -1) {
      submitterAllowed = true;
    }

    if (!submitterAllowed && submissionStatus !== 'published') {
      accessible = false;
    }

    return accessible;
  }

  /**
   * pull submission when required, when:
   * - no submission available in the redirection from activity-view/event-view pages
   * - [save] clicked & saved from assessment-group.page.ts
   *
   * @return {Promise<any>}
   */
  private pullSubmissions(): Promise<any> {
    return new Promise((resolve, reject) => {
      // 2nd batch API requests (get_submissions)
      Observable.forkJoin(
        this.submissionService.getSubmissionsByReferences(
          this.activity.References
        ))
        .subscribe(allSubmissions => {
          /** allSubmissions - response format:
           *  [ // context_ids
           *    [ // assessment group 1
           *      assessment1,
           *      assessment2,
           *      ...
           *    ],
           *    [ // assessment group 2
           *      assessment1,
           *      assessment2,
           *      ...
           *    ],
           *    ...
           *  ]
           */
          let submissions = [];
          _.forEach(allSubmissions, group => {
            _.forEach(group, submission => {
                submissions.push(this.submissionService.normalise(submission));
            });
          });

          this.submissions = this.filterSubmissions(submissions);
          resolve(submissions);
        }, err => {
          console.log('err', err);
          reject(err);
        });
    });
  }

  private filterSubmissions(submissions) {
    let results = []; // filtered submissions

    // check if a submission is specified (from previous page, from NavParams)
    let currentSubmission = this.navParams.get('currentSubmission');

    // filteredSubmission: store only submissions related to
    // currentSubmission (if currentSubmission above exist)
    let filteredSubmissions = [];
    submissions.forEach(submission => {
      if (currentSubmission && currentSubmission.id === submission.id) {
        filteredSubmissions = filteredSubmissions.concat([
          submission
        ]);
      }
    });

    // prepare statuses of submissions for different condition filtering (activity & event)
    // Statuses: `in progress`, `done`

    // "in progress" never > 1 (cuz "_.find" return only 1 found value)
    let hasInProgress = _.find(submissions, {status: 'in progress'});
    let isNew = (!currentSubmission && (filteredSubmissions.length === 0 || !_.isEmpty(hasInProgress)));
    let isDone = _.find(submissions, {status: 'done'}); // "done" for view checkin
    let isCheckin = (this.navParams.get('event') && isDone);

    if (isCheckin) { // on event's view checkin, no status filtering required
      results = submissions;
    } else if (isNew) { // on new submission
      results = !_.isEmpty(hasInProgress) ? [hasInProgress] : [];
    } else if (!isNew && hasInProgress) { // on resume "in progress"
      results = results.concat([
        hasInProgress
      ]);
    } else if (currentSubmission) { // display current submission
      results = results.concat([
        currentSubmission
      ]);
    }

    return results;
  }

  /**
   * @name preStackTasks
   * @description stack of tasks prepared to handle multiple activity references (ids)
   */
  preStackTasks() {
    // get_assessments request with "assessment_id" & "structured"
    let getAssessment = (assessmentId) => {
      // @TODO: we might need to pass in submission id (if available) to get properly filtered assessmnet questions
      return this.assessmentService.getAll({
        search: {
          assessment_id: assessmentId,
          structured: true
        }
      });
    };

    let tasks: Array<any> = [];
    // Congregate assessment ids for rxjs forkJoin (batch API requests)
    _.forEach(this.activity.References, ref => {
      if (ref.Assessment && ref.Assessment.id) {
        tasks.push(getAssessment(ref.Assessment.id));
      }
    });

    return tasks;
  }

  loadQuestions(): Promise<any> {
    return new Promise((resolve, reject) => {
      /**
       * merging submission into question inside of assessment array objects
       * - set question statuses (quantity of total answered)
       * - set submission button status
       */
      let preprocessAssessmentSubmission = (assessments) => {
        this.assessmentGroups = this.mapSubmissionsToAssessment(
          this.submissions,
          assessments
        );

        // Only allow submit when all required question have answered.
        _.forEach(this.assessmentGroups, groups => {
          _.forEach(groups, assessment => {
            let groupWithAnswers = 0;
            _.forEach(assessment.AssessmentGroup, group => {
              if (group.answeredQuestions >= group.totalRequiredQuestions) {
                groupWithAnswers += 1;
              }
            });
            if (groupWithAnswers >= _.size(assessment.AssessmentGroup)) {
              this.allowSubmit = true;
            }
          });
        });

        _.forEach(this.submissions, submission => {
          if (
            submission.status === 'pending review' ||
            submission.status === 'pending approval' ||
            submission.status === 'published' || // moderated type (reviews & published)
            submission.status === 'done' // survey type
          ) {
            this.allowSubmit = false;
          }
        });

        resolve({
          assessmentGroups: this.assessmentGroups,
          submissions: this.submissions
        });
      };

      let setSubmissionAndAssessment = (assessments) => {
        this.submissions = this.navParams.get('submissions');

        // check if this is from single submission view
        let currentSubmission = this.navParams.get('currentSubmission');
        if (currentSubmission) {
          this.submissions = [currentSubmission];
        }

        // pull new when submission is updated or currentSubmission is empty
        if (this.submissionUpdated || !currentSubmission) {
          this.pullSubmissions().then(res => {
            preprocessAssessmentSubmission(assessments);
          }, err => {
            reject(err);
          });
          this.submissionUpdated = false;
        } else {
          preprocessAssessmentSubmission(assessments);
        }
      };

      // first batch API requests (get_assessments)
      Observable.forkJoin(this.preStackTasks())
        .subscribe(setSubmissionAndAssessment, err => {
          reject(err);
        });
    });
  }


  /**
   * submit answer and change submission status to done
   */
  doSubmit() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });

    loading.present().then(() => {
      let tasks = [];
      _.forEach(this.submissions, (submission) => {

          // @TODO: investigate what causes absent of assessment_id/id/context_id
          if (
            submission &&
            submission.assessment_id &&
            submission.context_id &&
            submission.id
          ) {
            tasks.push(this.assessmentService.submit({
              Assessment: {
                id: submission.assessment_id,
                context_id: submission.context_id,
                in_progress: false
              },
              AssessmentSubmission: {
                id: submission.id
              },
              AssessmentSubmissionAnswer: _.map(submission.answer, (answ) => {
                if (answ && answ.assessment_question_id && answ.answer) {
                  return {
                    assessment_question_id: answ.assessment_question_id,
                    answer: answ.answer
                  }
                }
              })
            }));
          }
      });

      Observable
        .forkJoin(tasks)
        .subscribe(
          (assessments: any) => {
            loading.dismiss().then(_ => {
              this.allowSubmit = false;
              this.popupAfterSubmit();
            });
          },
          err => {
            loading.dismiss().then(_ => {
              console.log('err', err);
            });
          }
        );
    });
  }

  clickSubmit() {
    const confirm = this.alertCtrl.create({
      title: 'Confirm Submission',
      message: this.submitConfirmMessage,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.doSubmit();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Submit cancelled');
          }
        }
      ]
    });
    confirm.present();
  }

  // items popup
  popupAfterSubmit() {
    const loading = this.loadingCtrl.create({
      content: this.loadingMessages
    });
    const alert = this.alertCtrl.create({
      title: 'Submission Successful',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Move to dashboard
            this.navCtrl.parent.select(0);
            // this.navCtrl.setRoot(ActivitiesListPage); // dashboard page
          }
        }
      ]
    });

    // get initial items
    _.forEach(this.getInitialItems, element => {
      let id = element.id;
      if(!this.initialItemsCount[id]){
        this.initialItemsCount[id] = 0;
      }
      this.initialItemsCount[id]++;
    });
    // get latest updated items data api call
    loading.present();

    this.gameService.getItems({
      character_id: this.getCharacterID
    }).subscribe(
          data => {
            this.newItemsData = data.Items;
            _.forEach(data.Items, (element, index) => {
              let id = element.id;
              if(!this.newItemsCount[id]){
                this.newItemsCount[id] = 0;
              }
              this.newItemsCount[id]++;
            });
            // compare with previous get_characters() results and generate final index value array result
            _.forEach(this.newItemsCount, (element, id) => {
              if(!this.initialItemsCount[id]){
                this.totalItems.push({ "count": element, "id": id });
              }else {
                let diffCountVal = element - this.initialItemsCount[id];
                if(diffCountVal > 0){
                  this.totalItems.push({ "count": diffCountVal, "id": id });
                }
              }
            });
            _.forEach(this.totalItems, (element, index) => {
              element.id = parseInt(element.id);
            });
            this.allItemsData = _.intersectionBy(this.newItemsData, this.totalItems, 'id');
            // get the final object with item occurance count value
            let groupData = _.groupBy(this.totalItems, 'id');
            if(this.allItemsData.length === 0){
              this.gotNewItems = false;
              this.cacheService.setLocal('gotNewItems', this.gotNewItems);
              loading.onDidDismiss(() => {
                alert.present(); // redirect to dashboard page
              });
              loading.dismiss();
            } else {
              _.map(this.allItemsData, (ele) => {
                this.combinedItems.push(_.extend({count: groupData[ele.id] || []}, ele))
              });
              // display items on dashboard page
              this.gotNewItems = true;
              this.cacheService.setLocal('gotNewItems', this.gotNewItems);
              this.cacheService.setLocalObject('allNewItems', this.combinedItems);
              loading.onDidDismiss(() => {
                this.navCtrl.setRoot(ActivitiesListPage);
              });
              loading.dismiss();
            }
          },
          err => {
            loading.dismiss().then(() => {
              console.log("Err: ", err);
            });
          }
        );
  }

  gotoAssessment(assessmentGroup, activity) {
    this.navCtrl.push(AssessmentsGroupPage, {
      assessmentGroup,
      activity,
      submission: assessmentGroup.submission, // use back the one back from ActivityViewPage
      submissions: this.submissions,
      event: this.navParams.get('event')
    }).then(() => {
      this.traceAssessmentProgress();
    });
  }
}
