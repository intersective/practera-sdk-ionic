import { Component, ViewChild } from '@angular/core';
import {
  NavParams,
  NavController,
  Navbar,
  LoadingController,
  AlertController
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

  assessment: any = {};
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
    private submissionService: SubmissionService,
    private translationService: TranslationService
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
              _.forEach(submission.AssessmentSubmissionAnswer, (answer) => {
                if (answer.assessment_question_id === question.id) {
                  assessments[i][j].AssessmentGroup[k].questions[l].answer = answer;
                }
              });

              // find reviewer feedback
              _.forEach(submission.AssessmentReviewAnswer, (reviewerAnswer) => {
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
            if (q.answer && q.answer !== null) {
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

  private pullSubmissions(): Promise<any> {
    return new Promise((resolve, reject) => {
      // 2nd batch API requests (get_submissions)
      // response format: [ // context_ids
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
      Observable.forkJoin(this.submissionService.getSubmissionsByReferences(this.activity.References))
        .subscribe((allSubmissions) => {
          let submissions = [];
          _.forEach(allSubmissions, group => {
            _.forEach(group, (submission) => {
              submissions.push(this.submissionService.normalise(submission));
            });
          });
          this.submissions = submissions;
          console.log('this.submissions', this.submissions);
          resolve(submissions);
        },
        (err) => {
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

      let preprocessAssessmentSubmission = () => {

        this.assessmentGroups = this.mapSubmissionsToAssessment(
          this.submissions,
          this.assessmentGroups
        );

        // Only allow submit when all required question have answered.
        _.forEach(this.assessmentGroups, (group, i) => {
          _.forEach(group, (assessment, j) => {
            let groupWithAnswers = 0;
            _.forEach(assessment.AssessmentGroup, (g) => {
              if (g.answeredQuestions >= g.totalRequiredQuestions) {
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
            submission.status === 'published'
          ) {
            this.allowSubmit = false;
          }
        });

        console.log('this.assessmentGroups', this.assessmentGroups);
        console.log('allowSubmit', this.allowSubmit);
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

            if (this.submissions.length === 0) {
              this.pullSubmissions().then(res => {
                preprocessAssessmentSubmission();
              }, err => {
                reject(err);
              });
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
   * submit answer and change submission status to done
   */
  doSubmit() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    }),

    // Error handling for all kind of non-specific API respond error code
    alert = this.alertCtrl.create({
      buttons: ["Ok"]
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
            loading.dismiss().then(() => {
              console.log('assessments', assessments);
              this.allowSubmit = false;

              if (!_.isEmpty(this.navParams.get('event'))) {
                // display checkin successful (in event submission)
                alert.data.title = 'Checkin Successful!';
                alert.present().then(() => {
                  this.navCtrl.pop();
                });
              } else {
                // normal submission should redirect user back to previous stack/page
                alert.data.title = 'Submit Success!';
                alert.present().then(() => {
                  this.navCtrl.pop();
                });
                this.navCtrl.pop();
              }
            });
          },
          err => {
            loading.dismiss().then(() => {
              alert.data.title = err.msg || alert.data.title;
              alert.present();
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

  gotoAssessment(assessmentGroup, activity) {
    console.log('activity', activity);
    this.navCtrl.push(AssessmentsGroupPage, {
      assessmentGroup,
      activity,
      submission: assessmentGroup.submission, // use back the one back from ActivityViewPage
      submissions: this.submissions,
      event: this.navParams.get('event')
    });
  }
}
