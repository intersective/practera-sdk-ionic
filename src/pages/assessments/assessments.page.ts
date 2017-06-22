import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  templateUrl: './assessments.html'
})
export class AssessmentsPage {
  activity: any;

  constructor(
    private navParams: NavParams
  ) {
    this.activity = navParams.get('activity');
  }
}
