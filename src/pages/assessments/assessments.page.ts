import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController, AlertController, Navbar } from 'ionic-angular';
import { CacheService } from '../../shared/cache/cache.service';
import * as _ from 'lodash';

@Component({
  templateUrl: './assessments.html'
})
export class AssessmentsPage {
  @ViewChild(Navbar) navbar: Navbar;

  activity: any;
  assessments: any;
  answers: any;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private cache: CacheService,
    private navCtrl: NavController
  ) {
    this.activity = this.navParams.get('activity');
    this.assessments = this.activity.ActivitySequence || [];

    console.log('this.assessments', this.assessments);

    this.cache.setLocalObject('answersSummary', {
      19: {
        type: 'checkin',
        text: '1 file uploaded.'
      },
      28: {
        type: 'survey',
        text: 'This is answer for a survey...'
      },
      25: {
        type: 'quiz',
        text: 'This is answer for a quiz...'
      },
      24: {
        type: 'profile',
        text: 'LinkedIn is linked.'
      }
    });

    this.answers = this.cache.getLocalObject('answersSummary') || {};

    console.log('this.answers', this.answers);

    _.forEach(this.assessments, (assessment, key) => {
      if (this.answers[assessment['Assess.Assessment'].id]) {
        this.assessments[key]['Assess.Assessment'].answer =
          this.answers[assessment['Assess.Assessment'].id];
      } else {
        this.assessments[key]['Assess.Assessment'].answer = null;
      }
    });

    console.log('this.assessments', this.assessments);
  }

  ionViewDidLoad() {
    this.navbar.backButtonClick = (e: UIEvent) => {
      this.clickDiscard();
    }
  }

  doDiscard() {
    this.cache.setLocalObject('answers', {});
    _.forEach(this.assessments, (assessment, key) => {
      this.assessments[key]['Assess.Assessment'].answer = null;
    });
  }

  clickDiscard() {
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
}
