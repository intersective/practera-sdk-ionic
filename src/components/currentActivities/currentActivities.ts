import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as _ from 'lodash';

import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'current-activities',
  templateUrl: 'currentActivities.html'
})
export class CurrentActivitiesComponent {

  public activities = [
    {
      id: 1,
      name: 'Activity 1 (Fake)',
    }
  ];

  constructor(
    public navCtrl: NavController,
    public activityService: ActivityService
  ) {}

  ionViewDidEnter() {
    this.activityService.getList()
    .toPromise()
    .then((result: any) => {
      this.activities = _.map(result.data, this.activityService.normalise);
    }, (err: any) => console.log(err))
    .catch((err) => {
      console.log('err', err)
    });
  }

}
