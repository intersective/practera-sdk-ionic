import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
@Component({
  templateUrl: './assessments-group.html',
})

export class AssessmentsGroupPage {
  groups = [];

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController
  ) {}

  ionViewDidEnter() {
    this.groups = this.navParams.get('groups') || [
      {
        type: 'oneof'
      },
      {
        type: 'file'
      },
      {
        type: 'text'
      }
    ];
  }
}
