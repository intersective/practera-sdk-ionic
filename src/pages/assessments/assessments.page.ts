import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';
import { CacheService } from '../../shared/cache/cache.service';
import * as _ from 'lodash';

@Component({
  templateUrl: './assessments.html'
})
export class AssessmentsPage {
  activity: any;
  assessments: any;
  answers: any;

  constructor(
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private cache: CacheService,
  ) {
    this.activity = this.navParams.get('activity');
    this.assessments = this.activity.ActivitySequence || [];

    console.log('this.assessments', this.assessments);

    this.cache.setLocalObject('answers', {
      29: {
        type: 'file',
        url: 'https://placeimg.com/100/100/tech/grayscale'
      }
    });

    this.answers = this.cache.getLocalObject('answers') || [];

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

  doDiscard() {
    console.log('Okay');
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
