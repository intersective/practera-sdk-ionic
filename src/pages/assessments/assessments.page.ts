import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';

@Component({
  templateUrl: './assessments.html'
})
export class AssessmentsPage {
  activity: any;
  assessments: any;

  constructor(
    private navParams: NavParams,
    public alertCtrl: AlertController,
  ) {
    this.activity = this.navParams.get('activity');
    this.assessments = this.activity.ActivitySequence || [];
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
