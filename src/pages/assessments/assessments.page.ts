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
              this.assessment = _.head(assessments)[0].Assessment || {};
            }
            resolve();
          },
          (e) => {
            console.log('e', e);
            reject();
          },
          () => {
            // @TODO: remove it later
            // this.submissionService.getSubmissions()
            // .subscribe(
            //   (submissions) => {
            //     console.log('submissions', submissions)
            //
            //     // Mapping answer to question
            //
            //     _.forEach(this.assessmentGroups, (group, idx) => {
            //
            //     });
            //
            //
            //     //
            //     _.forEach(submissions, (submission) => {
            //       if (submission) {
            //         _.forEach(submission.AssessmentSubmissionAnswer, (answer) => {
            //           _.forEach(this.assessmentGroups, (group, idx) => {
            //             console.log('group', group)
            //
            //             let foundQuestionIdx = _.findIndex(group.AssessmentQuestion, {
            //               id: 115 //answer.assessment_question_id
            //             });
            //
            //             if (foundQuestionIdx > -1) {
            //               console.log('Inject answer to ', this.assessmentGroups[idx].AssessmentQuestion[foundQuestionIdx].id)
            //               this.assessmentGroups[idx].AssessmentQuestion[foundQuestionIdx].answer = answer;
            //             }
            //           });
            //
            //         });
            //       }
            //     });
            //
            //
            //     console.log('this.assessmentGroups 2', this.assessmentGroups);
            //   },
            //   (err) => {
            //     console.log('err', err)
            //   }
            // );

            // Not really test it because it
            // only can test it when allow to do submission
            // Observable.forkJoin(submissionTasks)
            //   .subscribe(
            //     (submissions) => {
            //       // Mapping answer to question
            //       _.forEach(submissions, (submission) => {
            //         if (submission) {
            //           _.forEach(submission.AssessmentSubmissionAnswer, (answer) => {
            //             _.forEach(this.assessmentGroups, (group, idx) => {
            //               let foundQuestionIdx = _.findIndex(group.AssessmentQuestion, {
            //                 id: answer.assessment_question_id
            //               });
            //
            //               if (foundQuestionIdx > -1) {
            //                 console.log('Inject answer to ', this.assessmentGroups[idx].AssessmentQuestion.id)
            //                 this.assessmentGroups[idx].AssessmentQuestion[foundQuestionIdx].answer = answer;
            //               }
            //             });
            //
            //           });
            //         }
            //       });
            //
            //
            //       console.log('this.assessmentGroups 2', this.assessmentGroups);
            //     },
            //     (err) => {
            //       console.log('err', err)
            //     }
            //   );
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
      message: 'Do you really want to discard all your change?',
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
      message: 'Do you really want to submit this evidence?',
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
