import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: './assessment.html'
})

export class AssessmentsPage {
  activity;

  constructor(
    private navParams: NavParams
  ) {}

  ionViewDidEnter() {
    this.activity = this.navParams.get('activity');
  }
}
