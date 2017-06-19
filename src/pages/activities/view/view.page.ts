import { Component } from '@angular/core';
import { ActivityService } from '../../../services/activity.service';

@Component({
  templateUrl: './view.html'
})

export class ActivitiesViewPage {
  currentActivity: Object;
  constructor(private activity: ActivityService) {}

  ionViewDidEnter(): void {
    this.activity.getList().then(activities => this.currentActivity = activities);
  }
}
