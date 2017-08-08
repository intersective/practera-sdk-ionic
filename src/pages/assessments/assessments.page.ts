import { Component, ViewChild } from '@angular/core';
import {
  NavParams,
  NavController,
  AlertController,
  Navbar,
  LoadingController,
  ModalController,
  PopoverController
} from 'ionic-angular';
import { confirmMessages, errMessages, loadingMessages } from '../../app/messages'; 
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
//services
import { AssessmentService } from '../../services/assessment.service';
import { CacheService } from '../../shared/cache/cache.service';
import { CharactersService } from '../../services/characters.service';
import { SubmissionService } from '../../services/submission.service';
import { TranslationService } from '../../shared/translation/translation.service';
// pages
import { AssessmentsGroupPage } from './group/assessments-group.page'
import { ItemsPopupPage } from './popup/items-popup.page';
class ActivityBase {
  id: number;
  name: string;
  description: string;
}

class ReferenceAssessmentBase {
  id: number;
  name: string;
}

class ReferenceBase {
  context_id: number;
  Assessment: ReferenceAssessmentBase
}

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
  allowSubmit: any = true;
  submissions: any = [];
  getInitialItems: any = this.cacheService.getLocalObject('initialItems');
  // getInitialItems: any = [];
  initialItemsCount: any = {};
  newItemsCount: any = {};
  newItemsData: any = [];
  totalItems: any = [];
  allItemsData: any = [];
  combinedItems: any = [];
  noItems: boolean = null;
  outputData: any = [];
  public loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  // confirm message variables
  private discardConfirmMessage = confirmMessages.Assessments.DiscardChanges.discard;
  private submitConfirmMessage = confirmMessages.Assessments.SubmitConfirmation.confirm;
  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private assessmentService: AssessmentService,
    private charactersService: CharactersService,
    private cacheService: CacheService,
    private submissionService: SubmissionService,
    private translationService: TranslationService
  ) {
    this.activity = this.navParams.get('activity');
    if (!this.activity) {
      throw "Fatal Error: Activity not available";
    }

    this.activity = this.normaliseActivity(this.activity);
    console.log('this.activity', this.activity);
  }

  ionViewDidLoad() {}

  /*
  Turn Activity object from:
    {
      "Activity": {
        "id": 14,
        "name": "Warm-up Round",
        "description": "...",
        ...
      },
      "ActivitySequence": [
        ...
      ],
      "References": [
        {
          "context_id": 1,
          "Assessment": {
            "id": 31,
            "name": "Checkin Assessment"
          }
        },
        ...
      ]
    }
  */
  normaliseActivity = (activity) => {
    let normalisedActivity: ActivityBase;

    if (activity.Activity) {
      normalisedActivity = {
        id: activity.Activity.id,
        name: activity.Activity.name,
        description: activity.Activity.description
      }
    }

    // Some response from API use non-capitalised letters
    if (activity.activity) {
      normalisedActivity = {
        id: activity.activity.id,
        name: activity.activity.name,
        description: activity.activity.description
      }
    }

    activity.Activity = normalisedActivity;

    // Normalise activity reference
    activity.References.forEach((reference, idx) => {
      let referenceAssessment: ReferenceAssessmentBase = {
        id: reference.Assessment.id,
        name: reference.Assessment.name,
      }
      let normalisedReference: ReferenceBase = {
        context_id: reference.context_id,
        Assessment: referenceAssessment
      };
      activity.References[idx] = normalisedReference;
    });

    return activity;
  };

  /**
   * @description mapping assessments and submissions
   * @param {Object} assessments assessments
   * @param {Object} submissions submissions
   */
  mapAssessmentsAndSubmissions(assessments, allSubmissions) {
    _.forEach(assessments, (group, i) => {
      _.forEach(group, (assessment, j) => {

        _.forEach(assessment.AssessmentGroup, (assessmentGroup, k) => {
          _.forEach(assessmentGroup.AssessmentGroupQuestion, (question, l) => {
            // Inject empty answer
            assessments[i][j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.answer = null;

            // Find submission
            _.forEach(allSubmissions, (submissions) => {
              _.forEach(submissions, (submission) => {
                _.forEach(submission.AssessmentSubmissionAnswer, (answer) => {
                  if (answer.assessment_question_id === question.id) {
                    this.assessmentGroups[i][j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.answer = answer;
                  }
                });
              });
            });
          });

          // Summarise basic answer information
          assessments[i][j].AssessmentGroup[k].totalQuestions =
            _.size(assessmentGroup.AssessmentGroupQuestion);

          assessments[i][j].AssessmentGroup[k].answeredQuestions = 0;
          _.forEach(assessmentGroup.AssessmentGroupQuestion, (q) => {
            if (q.AssessmentQuestion.answer !== null) {
              assessments[i][j].AssessmentGroup[k].answeredQuestions += 1;
            }
          });
        });
      });
    });

    return assessments;
  }

  loadQuestions(): Promise<any> {
    let self = this;
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

      // get_submissions API to retrieve submitted answer
      let getSubmissions = (contextId) => {
        return this.submissionService.getSubmissions({
          search: {
            context_id: contextId
          }
        });
      };

      // Congregation of get_submissions API Observable with different context_id
      let submissionTasks = [];
      _.forEach(this.activity.References, (reference) => {
        if (reference.context_id) {
          return submissionTasks.push(getSubmissions(reference.context_id));
        }
      });

      // first batch API requests (get_assessments)
      Observable.forkJoin(tasks)
        .subscribe(
          (assessments: any) => {
            this.assessmentGroups = assessments;

            console.log('this.assessmentGroups', this.assessmentGroups);

            // This use in tittle of the page.
            // In normal case, we only have one assessment in this page.
            // if (assessments) {
            //   this.assessment = _.head(_.head(assessments)).Assessment || {};
            //   console.log('this.assessment', this.assessment)
            // }

            // 2nd batch API requests (get_submissions)
            Observable.forkJoin(submissionTasks)
              .subscribe((allSubmissions) => {
                console.log('allSubmissions', allSubmissions);
                this.submissions = allSubmissions;

                this.assessmentGroups = this.mapAssessmentsAndSubmissions(
                  this.assessmentGroups,
                  allSubmissions
                );

                // Check all questions have submitted
                _.forEach(this.assessmentGroups, (group, i) => {
                  _.forEach(group, (assessment, j) => {
                    _.forEach(this.assessmentGroups[i][j].AssessmentGroup, (g) => {
                      if (g.answeredQuestions < g.totalQuestions) {
                        this.allowSubmit = false;
                      }
                    });
                  });
                });

                // Set submit button to false since submission was done
                _.forEach(this.submissions, (submission, i) => {
                  _.forEach(submission, (subm) => {
                    if (subm.AssessmentSubmission.status === 'done') {
                      this.allowSubmit = false;
                    }
                  });
                });

                console.log('this.assessmentGroups', this.assessmentGroups);
                console.log('allowSubmit', this.allowSubmit);
                resolve();
              },
              (err) => {
                console.log('err', err);
                reject();
              });
          },
          (e) => {
            console.log('e', e);
            reject();
          }
        );
    });
  }

  ionViewWillEnter() {
    this.assessment = this.navParams.get('assessment');

    let loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.loadQuestions()
      .then(() => {
        loader.dismiss();
      })
      .catch((err) => {
        console.log(err);
        loader.dismiss();
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

    let alert = this.alertCtrl.create({
      title: 'Fail to submit',
      buttons: ["Ok"]
    });

    loading.present().then(() => {
      let tasks = [];
      _.forEach(this.submissions, (submission) => {
        console.log('submission', submission);

        _.forEach(submission, (subm) => {
          if (
            subm.AssessmentSubmission &&
            subm.AssessmentSubmission.assessment_id &&
            subm.AssessmentSubmission.context_id &&
            subm.AssessmentSubmission.id
          ) {
            tasks.push(this.assessmentService.submit({
              Assessment: {
                id: subm.AssessmentSubmission.assessment_id,
                context_id: subm.AssessmentSubmission.context_id,
                in_progress: false
              },
              AssessmentSubmission: {
                id: subm.AssessmentSubmission.id
              },
              AssessmentSubmissionAnswer: _.map(subm.AssessmentSubmissionAnswer, (answ) => {
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
      });

      console.log('tasks', tasks);

      Observable
        .forkJoin(tasks)
        .subscribe(
          (assessments: any) => {
            loading.dismiss().then(() => {
              console.log('assessments', assessments);
              this.allowSubmit = false;
              this.navCtrl.pop();
              this.popupAfterSubmit();
            });
          },
          (e) => {
            loading.dismiss().then(() => {
              alert.present();
              console.log('e', e);
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
    // get initial items 
    // console.log('Inital Items: ', this.getInitialItems);
    _.forEach(this.getInitialItems, element => {
      let id = element.id;
      console.log("id value: ", id);
      if(!this.initialItemsCount[id]){
        this.initialItemsCount[id] = 0;
      }
      this.initialItemsCount[id]++;
    });
    // console.log("Count for initial Items: ", this.initialItemsCount);
    // get latest updated items data api call 
    loading.present();
    this.charactersService.getCharacter()
        .subscribe(
          data => {
            // console.log("Items: ", data.Items);
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
            // console.log("New compared items: ", this.newItemsData);
            _.forEach(this.totalItems, (element, index) => {
              element.id = parseInt(element.id);
            });
            // console.log("Count for new total Items: ", this.totalItems);
            this.allItemsData = _.intersectionBy(this.newItemsData, this.totalItems, 'id');
            // console.log("Final items object data: ", this.allItemsData);
            // get the final object with item occurance count value
            let groupData = _.groupBy(this.totalItems, 'id');
            console.log("Group?? ", groupData);
            _.map(this.allItemsData, (ele) => {
              this.combinedItems.push(_.extend({count: groupData[ele.id] || []}, ele))
              // console.log("Final Combined results: ", this.combinedItems);    
            });
            loading.dismiss().then(() => {
              let itemsPopup = this.modalCtrl.create(ItemsPopupPage, {combined: this.combinedItems});
              console.log("combined object array data: ", this.combinedItems);
              itemsPopup.present();
              // reset array in case data repeat avoid unexpected errors
              this.initialItemsCount = {};
              this.newItemsCount = {};
              this.newItemsData = [];
              this.totalItems = [];
              this.allItemsData = [];
              this.combinedItems = []; 
            });
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
      assessment: this.assessment, // use back the one back from ActivityViewPage
      submissions: this.navParams.get('submissions')
    });
  }
}
