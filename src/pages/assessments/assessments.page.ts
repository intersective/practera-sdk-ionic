import { Component, ViewChild } from '@angular/core';
import {
  NavParams,
  NavController,
  Navbar,
  LoadingController,
  AlertController,
  ModalController,
  Events
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AssessmentService } from '../../services/assessment.service';
import { CacheService } from '../../shared/cache/cache.service';
import { CharacterService } from '../../services/character.service';
import { GameService } from '../../services/game.service';
import { SubmissionService } from '../../services/submission.service';
// pages
import { AssessmentsGroupPage } from './group/assessments-group.page'
import { ItemsPopupPage } from './popup/items-popup.page';
// import { TabsPage } from '../../pages/tabs/tabs.page';
import { ActivitiesListPage } from '../activities/list/list.page';
class ActivityBase {
  id: number;
  name: string;
  description: string;
}

import { TranslationService } from '../../shared/translation/translation.service';
import { confirmMessages, errMessages, loadingMessages } from '../../app/messages';
import * as _ from 'lodash';

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
  submissionUpdated: boolean = false; // event listener flag
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
  public loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  // confirm message variables
  private discardConfirmMessage = confirmMessages.Assessments.DiscardChanges.discard;
  private submitConfirmMessage = confirmMessages.Assessments.SubmitConfirmation.confirm;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private assessmentService: AssessmentService,
    private characterService: CharacterService,
    private cacheService: CacheService,
    private gameService: GameService,
    private submissionService: SubmissionService,
    private translationService: TranslationService,
    public modalCtrl: ModalController,
    public events: Events
  ) {
    this.activity = this.navParams.get('activity');
    if (!this.activity) {
      throw "Fatal Error: Activity not available";
    }

    console.log('this.activity', this.activity);
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
        console.log('assessment', assessment);

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

            // if (q.required && q.answer === null) {
            //   questionsStatus.push('incomplete');
            // }
            //
            // if (!q.required && q.answer === null) {
            //   questionsStatus.push('completed');
            // }
          });

          console.log('questionsStatus', questionsStatus);

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

        console.log('assessment 2', assessment);
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
  private pullSubmissions(): Promise<any> {
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
            if (!currentSubmission) {
              filteredSubmissions.push(subm);
            } else if (currentSubmission && currentSubmission.id === subm.id) {
              filteredSubmissions.push(subm);
            }
          });

          this.submissions = filteredSubmissions;
          console.log('this.submissions', this.submissions);
          resolve(submissions);
        }, err => {
          console.log('err', err);
          reject(err);
        });
    });
  }

  loadQuestions(): Promise<any> {
    return new Promise((resolve, reject) => {

      // get_assessments request with "assessment_id" & "structured"
      let getAssessment = (assessmentId) => {
        return this.assessmentService.getAll({
          search: {
            assessment_id: assessmentId,
            structured: true
          }
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
              console.log(this.navParams.get('currentSubmission'), this.submissions);
            }

            if (this.submissionUpdated) { // pull new when submission is updated
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
        console.log('submission', submission);

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
              console.log('assessments', assessments);
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
            // this.doSubmit();
            this.popupAfterSubmit();
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
    console.log('Inital Items: ', this.getInitialItems);
    _.forEach(this.getInitialItems, element => {
      let id = element.id;
      console.log("id value: ", id);
      if(!this.initialItemsCount[id]){
        this.initialItemsCount[id] = 0;
      }
      this.initialItemsCount[id]++;
    });
    console.log("Count for initial Items: ", this.initialItemsCount);
    // get latest updated items data api call
    loading.present();

    this.gameService.getGameItems(this.getCharacterID)
        .subscribe(
          data => {
            console.log("Items: ", data.Items);
            this.newItemsData = data.Items;
            _.forEach(data.Items, (element, index) => {
              let id = element.id;
              console.log("id value: ", id);
              if(!this.newItemsCount[id]){
                this.newItemsCount[id] = 0;
              }
              this.newItemsCount[id]++;
            });
            console.log("Count for final Items: ", this.newItemsCount);
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
            console.log("New compared items: ", this.newItemsData);
            // if(!this.totalItems){
              _.forEach(this.totalItems, (element, index) => {
                element.id = parseInt(element.id);
              });
              console.log("Count for new total Items: ", this.totalItems);
              this.allItemsData = _.intersectionBy(this.newItemsData, this.totalItems, 'id');
              console.log("Final items object data: ", this.allItemsData);
            // }
            _.forEach(this.totalItems, (element, index) => {
              element.id = parseInt(element.id);
            });
            console.log("Count for new total Items: ", this.totalItems);
            this.allItemsData = _.intersectionBy(this.newItemsData, this.totalItems, 'id');
            console.log("Final items object data: ", this.allItemsData);
            // get the final object with item occurance count value
            let groupData = _.groupBy(this.totalItems, 'id');
            console.log("Group?? ", groupData);
            if(this.allItemsData.length === 0){
              this.gotNewItems = false;
              this.cacheService.setLocal('gotNewItems', this.gotNewItems);
              loading.onDidDismiss(() => {
                alert.present(); // redirect to dashboard page
              });
              loading.dismiss();
            }else {
              _.map(this.allItemsData, (ele) => {
                this.combinedItems.push(_.extend({count: groupData[ele.id] || []}, ele))
                console.log("Final Combined results: ", this.combinedItems);
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
    console.log('activity', activity);
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
