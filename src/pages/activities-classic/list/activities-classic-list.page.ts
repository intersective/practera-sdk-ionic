import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';

import { ActivitiesViewPage } from '../../activities/view/activities-view.page';
import { ActivityService } from '../../../services/activity.service';

declare var _: any;

@Component({
  templateUrl: './list.html'
})
export class ActivitiesClassicListPage {
  public activities: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public activityService: ActivityService,
    public toastCtrl: ToastController,
    public loader: LoadingController
  ) {}

  // @TODO: Move to shared function later...
  public _error(err) {
    let toast = this.toastCtrl.create({
      message: err,
      duration: 5000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  /**
   * normalise activities
   */
  public normaliseActivities(activities): Array<any> {
    let result = [];

    activities.forEach((act, index) => {
      result[index] = _.merge(act.Activity, {
        activity: act.Activity,
        sequences: act.ActivitySequence,
        Activity: act.Activity,
        ActivitySequence: act.ActivitySequence,
      });
    });
    return result;
  }

  _pullData(acts, cb?) {
    let self = this;

    this.activityService.getList()
      .toPromise()
      .then(function(activities) {
        let result = [];
        activities.map((act, index) => {
          act = _.merge(act, act.Activity);
        });
        this.activities = activities;
        self.activities = activities;

        if (cb) {
          cb();
        }
      }, err => {
        this._error(err);
        console.log('err', err);

        if (cb) {
          cb();
        }
      });
  }

  public doRefresh(refresher) {
    this._pullData(this.activities, () => {
      if (refresher) {
        refresher.complete();
      }
    });
  }

  ionViewDidEnter() {

    let loader = this.loader.create();
    let self = this;

    loader.present().then(() => {
      this.activityService.getList()
        .subscribe(activities => {
          console.log(self.activities);
          activities = self.normaliseActivities(activities);

          self.activities = activities;
          loader.dismiss();
        });
    });
  }

  public hasReservation(activity) {
    return false;
  }

  public viewTicket(activity) {

  }

  public book(activity) {

  }

  public gotoActivity(activity) {
    console.log(activity);
    this.navCtrl.push(ActivitiesViewPage, {activity});
  }
}
