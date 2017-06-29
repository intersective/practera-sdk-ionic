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
  answers: any;

  allowSubmit: any = true;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private cache: CacheService,
    private navCtrl: NavController
  ) {
    this.activity = this.navParams.get('activity');

    this.cache.setLocalObject('answers', {
      19: {
        type: 'checkin',
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
        linked: true
      }
    });

    this.answers = this.cache.getLocalObject('answers') || {};

    _.forEach(this.activity.ActivitySequence, (assessment, key) => {
      if (this.answers[assessment['Assess.Assessment'].id]) {
        this.activity.ActivitySequence[key]['Assess.Assessment'].answer =
          this.answers[assessment['Assess.Assessment'].id];
      } else {
        this.allowSubmit = false;
        this.activity.ActivitySequence[key]['Assess.Assessment'].answer = null;
      }
    });
  }

  ionViewDidLoad() {
    this.navbar.backButtonClick = (e: UIEvent) => {
      this.clickDiscard();
    }
  }

  doDiscard() {
    this.cache.setLocalObject('answers', {});
    _.forEach(this.activity.ActivitySequence, (assessment, key) => {
      this.activity.ActivitySequence[key]['Assess.Assessment'].answer = null;
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
