import { Component, Input } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { ActivitiesViewPage } from '../view/view.page';
import { ActivityComponent } from '../../../components/activity/activity.component';
import { ActivityService } from '../../../services/activity.service';

@Component({
  selector: 'activities-list-page',
  templateUrl: 'list.html'
})
export class ActivitiesListPage {
  @Input() activity;
  public activities = [];

  constructor(
    public navCtrl: NavController,
    public activityService: ActivityService,
    public toastCtrl: ToastController
  ) {}

  // @TODO: Move to shared function later...
  private _error(err) {
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

  private _pullData(refresher = null) {
    return this.activityService.getList()
      .then((activities: any) => {
        this.activities = activities;
        if (activities.length === 0) {
          this.activities.push({
            id: 1,
            title: 'fake activity',
            description: 'some description'
          });
        }
        if (refresher) {
          refresher.complete();
        }
      }, err => {
        this._error(err);
        console.log('err', err);
        if (refresher) {
          refresher.complete();
        }
      });
  }

  public doRefresh(refresher) {
    return this._pullData(refresher);
  }

  ionViewDidEnter() {
    // @TODO: add loading indicator/marker
    this._pullData();
  }

  view(activity: Object | any = {}) {
    this.navCtrl.push(ActivitiesViewPage, {id: activity.id});
  }

  public hasReservation(activity) {
    return false;
  }

  public viewTicket(activity) {

  }

  public book(activity) {

  }
}
