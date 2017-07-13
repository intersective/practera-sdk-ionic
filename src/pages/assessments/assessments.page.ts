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

@Component({
  selector: 'assessments-page',
  templateUrl: './assessments.html'
})
export class AssessmentsPage {
  @ViewChild(Navbar) navbar: Navbar;

  // @Input() activity: any;

  activity: any = {};
  answers: any = {};

  assessment: any = {};
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
    private submissionService: SubmissionService
  ) {
    this.activity = this.navParams.get('activity');
    console.log('this.activity', this.activity);
  }

  ionViewDidLoad() {
    // Custom back button on page
    this.navbar.backButtonClick = (e: UIEvent) => {
      this.clickDiscard();
    }
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
            if (assessments) {
              this.assessment = _.head(_.head(assessments).assessments).Assessment || {};
              console.log('this.assessment', this.assessment)
            }

            Observable.forkJoin(submissionTasks)
              .subscribe((allSubmissions) => {
                console.log('allSubmissions', allSubmissions);

                _.forEach(this.assessmentGroups, (group, i) => {
                  _.forEach(group.assessments, (assessment, j) => {
                    _.forEach(assessment.AssessmentGroup, (assessmentGroup, k) => {
                      _.forEach(assessmentGroup.AssessmentGroupQuestion, (question, l) => {
                        this.assessmentGroups[i].assessments[j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.answer = null;

                        // Find submission
                        _.forEach(allSubmissions, (submissions) => {
                          _.forEach(submissions, (submission) => {
                            _.forEach(submission.AssessmentSubmissionAnswer, (answer) => {
                              if (answer.assessment_question_id === question.id) {
                                this.assessmentGroups[i].assessments[j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.answer = answer;
                              }
                            });
                          });
                        });

                      });

                      // Summarise basic answer information
                      this.assessmentGroups[i].assessments[j].AssessmentGroup[k].totalQuestions =
                        _.size(assessmentGroup.AssessmentGroupQuestion);
                      this.assessmentGroups[i].assessments[j].AssessmentGroup[k].answeredQuestions = 0;
                      _.forEach(assessmentGroup.AssessmentGroupQuestion, (q) => {
                        if (q.AssessmentQuestion.answer !== null) {
                          this.assessmentGroups[i].assessments[j].AssessmentGroup[k].answeredQuestions += 1;
                        }
                      });

                    });

                    _.forEach(this.assessmentGroups[i].assessments[j].AssessmentGroup, (g) => {
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

  gotoAssessment(group) {
    this.navCtrl.push(AssessmentsGroupPage, { group });
  }

  // @TODO: Remove it later...
  // clickFillAllAnswers() {
  //   _.forEach(this.assessmentQuestions, (question, key) => {
  //     console.log('q', question);
  //     if (question.question_type === 'file') {
  //       this.answers[question.id] = {
  //         type: 'file',
  //         files: [
  //           {
  //             mime: 'image/jpeg',
  //             url: 'https://placeimg.com/100/100/nature/grayscale'
  //           },
  //           {
  //             mime: 'image/jpeg',
  //             url: 'https://placeimg.com/100/100/nature/grayscale'
  //           }
  //         ]
  //       };
  //     }
  //
  //     if (question.question_type === 'oneof') {
  //       this.answers[question.id] = {
  //         type: 'file',
  //         answers: [
  //           {
  //             context: 'This is answer for ' + question.assessment_id
  //           }
  //         ]
  //       };
  //     }
  //
  //     this.loadQuestions();
  //   });
  // }
}
