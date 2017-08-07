import { Component, ViewChild } from '@angular/core';
import {
  NavParams,
  NavController,
  AlertController,
  Navbar,
  LoadingController
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { CacheService } from '../../shared/cache/cache.service';
import { AssessmentService } from '../../services/assessment.service';
import { SubmissionService } from '../../services/submission.service';

import { AssessmentsGroupPage } from './group/assessments-group.page'

import * as _ from 'lodash';

import { TranslationService } from '../../shared/translation/translation.service';
import { confirmMessages } from '../../app/messages';
export class ActivityBase {
  id: number;
  name: string;
  description: string;
}

export class ReferenceAssessmentBase {
  id: number;
  name: string;
}

export class ReferenceBase {
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

  // assessment: any = {};
  assessmentGroups: any = [];
  assessmentQuestions: any = [];
  allowSubmit: any = true;

  // confirm message variables
  private discardConfirmMessage = confirmMessages.Assessments.DiscardChanges.discard;
  private submitConfirmMessage = confirmMessages.Assessments.SubmitConfirmation.confirm;
  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private cache: CacheService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private assessmentService: AssessmentService,
    private translationService: TranslationService,
    private submissionService: SubmissionService,
  ) {
    this.activity = this.navParams.get('activity') || {};
    this.activity = this.normaliseActivity(this.activity);
    console.log('this.activity', this.activity);
  }

  ionViewDidLoad() {
    // Custom back button on page
    this.navbar.backButtonClick = (e: UIEvent) => {
      this.clickDiscard();
    }
  }

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
    let normalisedActivity: ActivityBase = {
      id: activity.Activity.id,
      name: activity.Activity.name,
      description: activity.Activity.description
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
  }

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
    return new Promise((resolve, reject) => {

      let getAssessment = (assessmentId) => {
        return this.assessmentService.getAll({
          search: {
            assessment_id: assessmentId,
            structured: true
          }
        });
      };

      let tasks = [];
      _.forEach(this.activity.References, (reference) => {
        if (
          reference.Assessment &&
          reference.Assessment.id
        ) {
          return tasks.push(getAssessment(reference.Assessment.id));
        }
      });

      let getSubmissions = (contextId) => {
        return this.submissionService.getSubmissions({
          search: {
            context_id: contextId
          }
        });
      }

      let submissionTasks = [];
      _.forEach(this.activity.References, (reference) => {
        if (reference.context_id) {
          return submissionTasks.push(getSubmissions(reference.context_id));
        }
      });

      Observable.forkJoin(tasks)
        .subscribe(
          (assessments: any) => {
            this.assessmentGroups = assessments;

            console.log('this.assessmentGroups', this.assessmentGroups);

            // This use in tittle of the page.
            // In normal case, we only have one assessment in this page.
            // if (assessments) {
            //   this.assessment = _.head(assessments).Assessment || {};
            //   console.log('this.assessment', this.assessment)
            // }

            Observable.forkJoin(submissionTasks)
              .subscribe((allSubmissions) => {
                console.log('allSubmissions', allSubmissions);

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

                console.log('this.assessmentGroups', this.assessmentGroups);
                console.log('allowSubmit', this.allowSubmit);
                resolve();
              },
              (err) => {
                console.log('err', err);
                reject();
              },
              () => {
                console.log('completed')
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
    // Hardcoded answers for now
    this.answers = this.cache.getLocalObject('answers') || {};

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

  doDiscard() {
    this.cache.setLocalObject('answers', {});
  }

  clickDiscard() {
    // Send alert to user before user click back page
    // If user click okay will remove all answers in local storage
    // No data will send to server
    const confirm = this.alertCtrl.create({
      title: 'Discard all change',
      message: this.discardConfirmMessage,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.doDiscard();
            this.navCtrl.pop();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Discard cancelled');
          }
        }
      ]
    });
    confirm.present();
  }

  doSubmit() {
    console.log('Okay');
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

  gotoAssessment(assessmentGroup, assessment, activity) {
    console.log('assessmentGroup', assessmentGroup);
    console.log('assessment', assessment);
    console.log('activity', activity);
    this.navCtrl.push(AssessmentsGroupPage, { assessmentGroup, assessment });
  }
}
