import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, Navbar, LoadingController, ModalController, AlertController, Events } from 'ionic-angular';
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
import { ActivitiesListPage } from '../activities/list/list.page';
// Others
import { confirmMessages, errMessages, loadingMessages } from '../../app/messages';
import * as _ from 'lodash';

@Component({
  selector: 'assessments-page',
  templateUrl: './assessments.html'
})
export class AssessmentsPage {
  @ViewChild(Navbar) navbar: Navbar;

  activity: any = {};
  allItemsData: any = [];
  allowSubmit: boolean = false;
  answers: any = {};
  assessment: any = {};
  assessmentGroups: any = [];
  assessmentQuestions: any = [];
  combinedItems: any = [];
  discardConfirmMessage = confirmMessages.Assessments.DiscardChanges.discard;
  getCharacterID: any = this.cacheService.getLocal('character_id');
  getInitialItems: any = this.cacheService.getLocal('initialItems');
  gotNewItems: boolean = false;
  isEventSubmission: boolean = false;
  initialItemsCount: any = {};
  loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  newItemsCount: any = {};
  newItemsData: any = [];
  noItems: boolean = null;
  outputData: any = [];
  submissions: any = [];
  submissionUpdated: boolean = false; // event listener flag
  submitConfirmMessage = confirmMessages.Assessments.SubmitConfirmation.confirm;
  totalItems: any = [];

  constructor(
    public alertCtrl: AlertController,
    public assessmentService: AssessmentService,
    public cacheService: CacheService,
    public events: Events,
    public gameService: GameService,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public navCtrl: NavController,
    public submissionService: SubmissionService,
    public translationService: TranslationService
  ) {
    this.activity = this.navParams.get('activity');
    if (!this.activity) {
      throw 'Fatal Error: Activity not available';
    }
  }

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.loadQuestions()
      .then(() => {
        loader.dismiss();
      }, err => {
        console.log('log::', err);
      })
      .catch((err) => {
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
   */
  mapSubmissionsToAssessment(submissions, assessments) {
    _.forEach(assessments, (group, i) => {
      _.forEach(group, (assessment, j) => {

        // normalise
        assessments[i][j] = assessment = this.assessmentService.normalise(assessment);

        _.forEach(assessment.AssessmentGroup, (assessmentGroup, k) => {
          _.forEach(assessmentGroup.questions, (question, l) => {
            // Inject empty answer fields
            // We will know thare are no submission when it is null
            assessments[i][j].AssessmentGroup[k].questions[l].answer = null;
            assessments[i][j].AssessmentGroup[k].questions[l].reviewerAnswer = null;

            // find submission
            _.forEach(submissions, (submission) => {
              // attach existing submission to assessment group it belongs to
              let group = this.assessmentGroups[i][j].AssessmentGroup[k];
              if (group.assessment_id === submission.assessment_id) {
                this.assessmentGroups[i][j].AssessmentGroup[k].submission = submission;
              }

              // find user answer
              _.forEach(submission.answer, (answer) => {
                if (answer.assessment_question_id === question.id) {
                  assessments[i][j].AssessmentGroup[k].questions[l].answer = answer;
                }
              });

              // find reviewer feedback
              _.forEach(submission.review, (reviewerAnswer) => {
                if (reviewerAnswer.assessment_question_id === question.id) {
                  assessments[i][j].AssessmentGroup[k].questions[l].reviewerAnswer = reviewerAnswer;
                }
              });
            });

          });

          // Summarise basic answer information
          // get total number of questions
          assessments[i][j].AssessmentGroup[k].totalRequiredQuestions = 0;
          _.forEach(assessmentGroup.questions, (q) => {
            if (q.required) {
              assessments[i][j].AssessmentGroup[k].totalRequiredQuestions += 1;
            }
          });

          // get total number of answered questions
          assessments[i][j].AssessmentGroup[k].answeredQuestions = 0;
          _.forEach(assessmentGroup.questions, (q) => {
            if (q.required && q.answer && q.answer !== null) {
              assessments[i][j].AssessmentGroup[k].answeredQuestions += 1;
            }
          });

          // get total number of feedback
          assessments[i][j].AssessmentGroup[k].reviewerFeedback = 0;
          _.forEach(assessmentGroup.questions, (q) => {
            // If API response, the reviewer's answer and comment are empty,
            // front-end don't consider it as a feedback
            if (
              q.reviewerAnswer &&
              q.reviewerAnswer !== null &&
              !_.isEmpty(q.reviewerAnswer.answer) &&
              !_.isEmpty(q.reviewerAnswer.comment)
            ) {
              assessments[i][j].AssessmentGroup[k].reviewerFeedback += 1;
            }
          });

          // Set status
          // let status = assessments[i][j].AssessmentGroup[k].status = 'incomplete';
          let questionsStatus = [];
          _.forEach(assessmentGroup.questions, (q) => {
            if (q.required && q.answer !== null) {
              if (
                q.reviewerAnswer !== null &&
                assessmentGroup.submission.status !== 'pending approval' &&
                (q.reviewerAnswer.answer || q.reviewerAnswer.comment)
              ) {
                questionsStatus.push('reviewed');
              } else {
                questionsStatus.push('completed');
              }
            }

            if (!q.required && q.answer !== null) {
              if (
                q.reviewerAnswer !== null &&
                assessmentGroup.submission.status !== 'pending approval' &&
                (q.reviewerAnswer.answer || q.reviewerAnswer.comment)
              ) {
                questionsStatus.push('reviewed');
              } else {
                questionsStatus.push('completed');
              }
            }

            if (q.answer === null) {
              questionsStatus.push('incomplete');
            }
          });

          assessments[i][j].AssessmentGroup[k].status = 'incomplete';
          if (_.every(questionsStatus, (v) => {
            return (v === 'completed');
          })) {
            assessments[i][j].AssessmentGroup[k].status = 'completed';
          }
          if (_.includes(questionsStatus, 'reviewed')) {
            assessments[i][j].AssessmentGroup[k].status = 'reviewed';
          }
        });
      });
    });

    return assessments;
  }

  /**
   * pull submission when required, when:
   * - no submission available in the redirection from activity-view/event-view pages
   * - [save] clicked & saved from assessment-group.page.ts
   *
   * @return {Promise<any>}
   */
  public pullSubmissions(): Promise<any> {
    return new Promise((resolve, reject) => {
      // 2nd batch API requests (get_submissions)
      Observable.forkJoin(
        this.submissionService.getSubmissionsByReferences(
          this.activity.References
        ))
        .subscribe(allSubmissions => {
          // allSubmissions - response format: [ // context_ids
          //   [ // assessment group 1
          //     assessment1,
          //     assessment2,
          //     ...
          //   ],
          //   [ // assessment group 2
          //     assessment1,
          //     assessment2,
          //     ...
          //   ],
          //   ...
          // ]
          let submissions = [];
          _.forEach(allSubmissions, group => {
            _.forEach(group, (submission) => {
                submissions.push(this.submissionService.normalise(submission));
            });
          });

          // check if a submission is specified
          let currentSubmission = this.navParams.get('currentSubmission');
          let filteredSubmissions = [];

          submissions.forEach(subm => {
            if (currentSubmission && currentSubmission.id === subm.id) {
              filteredSubmissions.push(subm);
            }
          });
          let hasInProgress = _.find(submissions, {status: 'in progress'}); // 'in progress' never > 1
          let isNew = (!currentSubmission && (filteredSubmissions.length === 0 || !_.isEmpty(hasInProgress)));

          if (isNew) { // new submission
            this.submissions = !_.isEmpty(hasInProgress) ? [hasInProgress] : [];
          } else if (!isNew && hasInProgress) { // resume 'in progress'
            filteredSubmissions.push(hasInProgress);
            this.submissions = filteredSubmissions;
          } else if (currentSubmission) { // display current submission
            filteredSubmissions.push(currentSubmission);
            this.submissions = filteredSubmissions;
          }
          resolve(submissions);
        }, (err) => {
          console.log('err', err);
          reject(err);
        });
    });
  }

  loadQuestions(): Promise<any> {
    return new Promise((resolve, reject) => {

      // get_assessments request with 'assessment_id' & 'structured'
      let getAssessment = (assessmentId) => {
        return this.assessmentService.getAll({
          assessment_id: assessmentId,
          structured: true
        });
      };

      // Congregation of assessment ids to fulfill get_assessments API's param requirement
      let tasks = [];
      _.forEach(this.activity.References, (reference) => {
        if (
          reference.Assessment &&
          reference.Assessment.id
        ) {
          return tasks.push(getAssessment(reference.Assessment.id));
        }
      });

      /**
       * merging submission into question inside of assessment array objects
       * - set question statuses (quantity of total answered)
       * - set submission button status
       */
      let preprocessAssessmentSubmission = () => {
        this.assessmentGroups = this.mapSubmissionsToAssessment(
          this.submissions,
          this.assessmentGroups
        );

        // Only allow submit when all required question have answered.
        _.forEach(this.assessmentGroups, groups => {
          _.forEach(groups, assessment => {
            let groupWithAnswers = 0;
            _.forEach(assessment.AssessmentGroup, group => {
              // console.log('group.answeredQuestions', group.answeredQuestions);
              // console.log('group.totalRequiredQuestions', group.totalRequiredQuestions);
              if (group.answeredQuestions >= group.totalRequiredQuestions) {
                groupWithAnswers += 1;
              }
            });
            // console.log('groupWithAnswers', groupWithAnswers, _.size(assessment.AssessmentGroup));
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

      // first batch API requests (get_assessments)
      Observable.forkJoin(tasks)
        .subscribe(
          (assessments: any) => {
            this.assessmentGroups = assessments;
            this.submissions = this.navParams.get('submissions');

            // check if this is from single submission view
            let currentSubmission = this.navParams.get('currentSubmission');
            if (currentSubmission) {
              this.submissions = [currentSubmission];
            }

            // pull new when submission is updated or currentSubmission is empty
            if (this.submissionUpdated || !currentSubmission) {
              this.pullSubmissions().then(res => {
                preprocessAssessmentSubmission();
              }, err => {
                reject(err);
              });
              this.submissionUpdated = false;
            } else {
              preprocessAssessmentSubmission();
            }
          },
          (err) => {
            console.log('err', err);
            reject(err);
          }
        );
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
      title: 'Submit evidence',
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
  popupAfterSubmit(){
    const loading = this.loadingCtrl.create({
      content: this.loadingMessages
    });
    const alert = this.alertCtrl.create({
      title: 'Submission Successful',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.navCtrl.setRoot(ActivitiesListPage); // dashboard page
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
    })
    .subscribe(
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
            this.totalItems.push({ 'count': element, 'id': id });
          }else {
            let diffCountVal = element - this.initialItemsCount[id];
            if(diffCountVal > 0){
              this.totalItems.push({ 'count': diffCountVal, 'id': id });
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
            this.combinedItems.push(_.extend({count: groupData[ele.id] || []}, ele));
          });
          // display items on dashboard page
          this.gotNewItems = true;
          this.cacheService.setLocal('gotNewItems', this.gotNewItems);
          this.cacheService.setLocal('allNewItems', this.combinedItems);
          loading.onDidDismiss(() => {
            this.navCtrl.setRoot(ActivitiesListPage);
          });
          loading.dismiss();
        }
      },
      err => {
        loading.dismiss().then(() => {
          console.log('Err: ', err);
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
