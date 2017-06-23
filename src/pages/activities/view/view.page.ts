import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ActivityService } from '../../../services/activity.service';
import { ActivitiesListPage } from '../list/list.page';
@Component({
  templateUrl: './view.html'
})
export class ActivitiesViewPage {
  currentActivity: any;
  currentId: any;
  constructor(private navParams: NavParams, private activity: ActivityService) {
    this.currentActivity = this.navParams.get('activity');
    console.log("Current Activity: ", this.currentActivity);
  }
  ionViewDidEnter(): void {}
}
