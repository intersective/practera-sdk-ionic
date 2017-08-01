import { Component, ViewChild } from '@angular/core';
import {
  NavParams,
  NavController,
  AlertController,
  Navbar,
  LoadingController
} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AssessmentService } from '../../services/assessment.service';
import { SubmissionService } from '../../services/submission.service';

import { AssessmentsGroupPage } from './group/assessments-group.page'

import { TranslationService } from '../../shared/translation/translation.service';
import { confirmMessages } from '../../app/messages';

import * as _ from 'lodash';

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
  allowSubmit: boolean = false;
  submissions: any = [];

  // confirm message variables
  private discardConfirmMessage = confirmMessages.Assessments.DiscardChanges.discard;
  private submitConfirmMessage = confirmMessages.Assessments.SubmitConfirmation.confirm;
  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private assessmentService: AssessmentService,
    private submissionService: SubmissionService
  ) {
    this.activity = this.navParams.get('activity');
    if (!this.activity) {
      throw "Fatal Error: Activity not available";
    }

    console.log('this.activity', this.activity);
  }

  ionViewDidLoad() {}

  /**
   * @description mapping assessments and submissions
   * @param {Object} submissions submissions
   * @param {Object} assessments assessments
   */
  mapSubmissionsToAssessment(allSubmissions, assessments) {
    _.forEach(assessments, (group, i) => {
      _.forEach(group, (assessment, j) => {

        _.forEach(assessment.AssessmentGroup, (assessmentGroup, k) => {
          _.forEach(assessmentGroup.AssessmentGroupQuestion, (question, l) => {
            // Inject empty answer fields
            assessments[i][j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.answer = null;
            assessments[i][j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.reviewerAnswer = null;

            // Find submission
            _.forEach(allSubmissions, (submissions) => {
              _.forEach(submissions, (submission) => {
                // found user answer
                _.forEach(submission.AssessmentSubmissionAnswer, (answer) => {
                  if (answer.assessment_question_id === question.id) {
                    this.assessmentGroups[i][j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.answer = answer;
                  }
                });

                // found reviewer feedback
                _.forEach(submission.AssessmentReviewAnswer, (reviewerAnswer) => {
                  if (reviewerAnswer.assessment_question_id === question.id) {
                    this.assessmentGroups[i][j].AssessmentGroup[k].AssessmentGroupQuestion[l].AssessmentQuestion.reviewerAnswer = reviewerAnswer;
                  }
                });
              });
            });
          });

          // Summarise basic answer information
          // get total number of questions
          assessments[i][j].AssessmentGroup[k].totalQuestions =
            _.size(assessmentGroup.AssessmentGroupQuestion);

          // get total number of answered questions
          assessments[i][j].AssessmentGroup[k].answeredQuestions = 0;
          _.forEach(assessmentGroup.AssessmentGroupQuestion, (q) => {
            if (q.AssessmentQuestion.answer !== null) {
              assessments[i][j].AssessmentGroup[k].answeredQuestions += 1;
            }
          });

          // get total number of feedback
          assessments[i][j].AssessmentGroup[k].reviewerFeedback = 0;
          _.forEach(assessmentGroup.AssessmentGroupQuestion, (q) => {
            // If API response, the reviewer's answer and comment are empty,
            // front-end don't consider it as a feedback
            if (
              q.AssessmentQuestion.reviewerAnswer !== null &&
              q.AssessmentQuestion.reviewerAnswer.answer !== null &&
              q.AssessmentQuestion.reviewerAnswer.comment !== null
            ) {
              assessments[i][j].AssessmentGroup[k].reviewerFeedback += 1;
            }
          });
        });
      });
    });

    return assessments;
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

            // 2nd batch API requests (get_submissions)
            Observable.forkJoin(submissionTasks)
              .subscribe((allSubmissions) => {
                this.submissions = allSubmissions;
                console.log('this.submissions', this.submissions);

                this.assessmentGroups = this.mapSubmissionsToAssessment(
                  this.submissions,
                  this.assessmentGroups
                );

                // Check all questions have submitted
                _.forEach(this.assessmentGroups, (group, i) => {
                  _.forEach(group, (assessment, j) => {
                    let groupWithAnswers = 0;
                    _.forEach(assessment.AssessmentGroup, (g) => {
                      if (g.answeredQuestions >= g.totalQuestions) {
                        groupWithAnswers += 1;
                      }
                    });
                    if (groupWithAnswers >= _.size(assessment.AssessmentGroup)) {
                      this.allowSubmit = true;
                    }
                  });
                });

                // Set submit button to false since submission was done
                // (Mean already submitted and done reviewed)
                _.forEach(this.submissions, (submission, i) => {
                  _.forEach(submission, (subm) => {
                    if (subm.AssessmentSubmission.status === 'done') {
                      this.allowSubmit = false;
                    }
                  });
                });

                console.log('this.assessmentGroups', this.assessmentGroups);
                console.log('allowSubmit', this.allowSubmit);
                resolve({
                  assessmentGroups: this.assessmentGroups,
                  submissions: this.submissions
                });
              },
              (err) => {
                console.log('err', err);
                reject(err);
              });
          },
          (err) => {
            console.log('err', err);
            reject(err);
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

      Observable
        .forkJoin(tasks)
        .subscribe(
          (assessments: any) => {
            loading.dismiss().then(() => {
              console.log('assessments', assessments);
              this.allowSubmit = false;
              this.navCtrl.pop();
            });
          },
          (e) => {
            loading.dismiss().then(() => {
              alert.present();
              console.log('err', e);
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

  gotoAssessment(assessmentGroup, activity) {
    console.log('activity', activity);
    this.navCtrl.push(AssessmentsGroupPage, {
      assessmentGroup,
      activity,
      assessment: this.assessment, // use back the one back from ActivityViewPage
      submissions: this.submissions
    });
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
