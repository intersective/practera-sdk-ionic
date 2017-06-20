import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';

import { ActivitiesViewPage } from '../view/view.page';
import { ActivityComponent } from '../../../components/activity/activity.component';
import { ActivityService } from '../../../services/activity.service';

@Component({
  selector: 'activities-list-page',
  templateUrl: 'list.html'
})
export class ActivitiesListPage implements OnInit {
  public activities = [];
  constructor(
    public navCtrl: NavController,
    public activityService: ActivityService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {}
  // get activities list data
  ngOnInit(){
    let loadingActivities = this.loadingCtrl.create({
      content: 'Loading ..'
    });
    let loadingFailed = this.toastCtrl.create({
      message: 'Sorry, laoding activity process is failed, please try it again later.',
      duration: 4000,
      position: 'bottom'
    });
    loadingActivities.present();
    this.activityService.getActivities()
        .subscribe( 
          data => {
            this.activities = data;
            loadingActivities.dismiss().then(() => {
              console.log("Activities: ", this.activities);
            });
          },
          err => {
            loadingActivities.dismiss().then(() => {
              console.log('Error of getting activity data, ', err);
              loadingFailed.present();
            });
          }
        )
  }
  // redirect to activity detail page
  goToDetail(activity: any, id: any){
    this.navCtrl.push(ActivitiesViewPage, { activity: activity, id: id });
  }
}
