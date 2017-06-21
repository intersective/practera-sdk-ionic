import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';

import { ActivitiesViewPage } from '../view/activities-view.page';
import { ActivityService } from '../../../services/activity.service';

declare var _: any;

@Component({
  templateUrl: './list.html'
})
export class ActivitiesListPage {
  private activities: Array<any> = [];

  constructor(
    private navCtrl: NavController,
    private activityService: ActivityService,
    private toastCtrl: ToastController,
    private loader: LoadingController
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

  /**
   * normalise activities
   */
  private normaliseActivities(activities): Array<any> {
    let result = [];

    activities.forEach((act, index) => {
      result[index] = act.Activity;
      result[index].activity = act.Activity;
      result[index].sequences = act.ActivitySequence;

      // raw
      result[index].Activity = act.Activity;
      result[index].ActivitySequence = act.ActivitySequence;
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
      /*this.activityService.getList()
        .subscribe(activities => {
          console.log(self.activities);
          activities = self.normaliseActivities(activities);

          self.activities = activities;
          loader.dismiss();
        });*/
        
        self.activities = self.normaliseActivities([{"Activity":{"id":32,"milestone_id":10,"name":"Workshop-1","description":"","video_url":"","order":null,"instructions":"","is_locked":false,"start":"2017-03-07 13:00:02","end":"2017-03-14 12:59:59","deadline":"2017-03-14 12:59:59"},"ActivitySequence":[{"id":70,"activity_id":32,"model":"Assess.Assessment","model_id":29,"order":0,"is_locked":false,"Assess.Assessment":{"id":29,"name":"Check-in 1","description":"Needs a description...","assessment_type":"checkin","is_live":true,"is_team":false,"score_type":"numeric","experience_id":2,"program_id":5,"deleted":false,"deleted_date":null,"comparison_group_size":3,"comparison_group_points":10,"review_period":72,"review_scope":"assessment","review_scope_id":null,"created":"2016-06-23 06:07:39.681326","modified":"2017-03-09 00:18:25","review_instructions":null,"is_repeatable":false,"num_reviews":null,"review_type":null,"review_role":null,"assign_team_mentors":null,"parent_id":null}}]},{"Activity":{"id":33,"milestone_id":10,"name":"Workshop-2","description":"","video_url":"","order":null,"instructions":"","is_locked":false,"start":"2017-03-14 13:00:03","end":"2017-03-21 12:59:59","deadline":"2017-03-21 12:59:59"},"ActivitySequence":[{"id":71,"activity_id":33,"model":"Assess.Assessment","model_id":30,"order":0,"is_locked":false,"Assess.Assessment":{"id":30,"name":"Check-in 2","description":"Needs a description...","assessment_type":"checkin","is_live":true,"is_team":false,"score_type":"numeric","experience_id":2,"program_id":5,"deleted":false,"deleted_date":null,"comparison_group_size":3,"comparison_group_points":10,"review_period":72,"review_scope":"assessment","review_scope_id":null,"created":"2016-06-23 06:07:39.681326","modified":"2017-03-09 00:21:02","review_instructions":null,"is_repeatable":false,"num_reviews":null,"review_type":null,"review_role":null,"assign_team_mentors":null,"parent_id":null}}]},{"Activity":{"id":34,"milestone_id":10,"name":"Workshop 3","description":"Event ah....","video_url":"","order":null,"instructions":"Testing workshop!","is_locked":false,"start":"2017-03-07 13:00:01","end":"2018-03-07 12:59:59","deadline":"2018-03-07 12:59:59"},"ActivitySequence":[{"id":72,"activity_id":34,"model":"Story.Topic","model_id":25,"order":0,"is_locked":false,"Story.Topic":{"id":25,"program_id":5,"title":"Whoooooo~","summary":"Summary~ short short~","videolink":"","created":"2016-06-23 06:07:39.681326","modified":"2017-06-05 08:02:15","story_type":"topic","feature_image_id":null,"author_id":1,"has_comments":true,"tags":"","slug":"whoooooo","collaboration_id":null,"comments":0,"experience_id":2,"assessment_id":null,"view_time":"0.5","parent_id":null,"has_attachment":true}}]}]);
        loader.dismiss();
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
