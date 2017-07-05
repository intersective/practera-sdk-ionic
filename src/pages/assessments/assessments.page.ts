import { Component, ViewChild } from '@angular/core';
import {
  NavParams,
  NavController,
  AlertController,
  Navbar,
  LoadingController
} from 'ionic-angular';
import { CacheService } from '../../shared/cache/cache.service';
import { AssessmentService } from '../../services/assessment.service';

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
  allowSubmit: any = true;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private cache: CacheService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private assessmentService: AssessmentService
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
      this.assessmentService.getAll({
        search: {
          assessment_id: this.activity.sequences[0]['Assess.Assessment'].id
        }
      }).subscribe(assessmentData => {
        console.log('assessmentData', assessmentData);
        this.assessment = assessmentData[0].Assessment;
        this.assessmentGroups = assessmentData[0].AssessmentGroup;
        this.assessmentQuestions = assessmentData[0].AssessmentQuestion;

        _.forEach(this.assessmentQuestions, (question, key) => {

          let idx = `assessment.group.${question.assessment_id}`;
          let exists = this.cache.getLocalObject(idx);

          if (exists.AssessmentSubmissionAnswer) {
            if (_.isString(exists.AssessmentSubmissionAnswer)) {
              this.assessmentQuestions[key].answer = exists.AssessmentSubmissionAnswer;
            } else {
              this.assessmentQuestions[key].answer = exists.AssessmentSubmissionAnswer[0].answer;
            }
          } else {
            this.allowSubmit = false;
            this.assessmentQuestions[key].answer = null;
          }


          // // Inject answers
          // if (this.answers[question.id]) {
          //   this.assessmentQuestions[key].answer = this.answers[question.id];
          // } else {
          //   // Set allowSubmit to false when some assessment no answer
          //   this.allowSubmit = false;
          //   this.assessmentQuestions[key].answer = null;
          // }
        });

        return resolve();
      }, reject);
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

  // @TODO: Remove it later...
  clickFillAllAnswers() {
    _.forEach(this.assessmentQuestions, (question, key) => {
      console.log('q', question);
      if (question.question_type === 'file') {
        this.answers[question.id] = {
          type: 'file',
          files: [
            {
              mime: 'image/jpeg',
              url: 'https://placeimg.com/100/100/nature/grayscale'
            },
            {
              mime: 'image/jpeg',
              url: 'https://placeimg.com/100/100/nature/grayscale'
            }
          ]
        };
      }

      if (question.question_type === 'oneof') {
        this.answers[question.id] = {
          type: 'file',
          answers: [
            {
              context: 'This is answer for ' + question.assessment_id
            }
          ]
        };
      }

      this.loadQuestions();
    });
  }
}
