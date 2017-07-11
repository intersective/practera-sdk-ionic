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
import { AssessmentsGroupPage } from './group/assessments-group.page';

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
    public translationService: TranslationService
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

      let getQuestion = (assessmentId) => {
        return this.assessmentService.getAll({
          search: {
            assessment_id: assessmentId
          }
        });
      };

      let tasks = [];
      _.forEach(this.activity.ActivitySequence, (assessment) => {
        if (
          assessment.model === 'Assess.Assessment' &&
          assessment.is_locked === false &&
          assessment.model_id
        ) {
          return tasks.push(getQuestion(assessment.model_id));
        }
      });

      Observable.forkJoin(tasks)
        .subscribe(
          (groupOfAssessments: any) => {
            _.forEach(groupOfAssessments, (assessments) => {
              _.forEach(assessments, (assessment) => {
                this.assessmentGroups = _.union(this.assessmentGroups, assessment);
              });
            });

            // This use in tittle of the page.
            // In normal case, we only have one assessment in this page.
            this.assessment = _.head(this.assessmentGroups).Assessment || {};
            resolve();

          },
          (e) => {
            console.log('e', e);
            reject();
          },
          () => {
            console.log('completed');
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
