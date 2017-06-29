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
      /*this.activityService.getList()
        .subscribe(activities => {
          console.log(self.activities);
          activities = self.normaliseActivities(activities);

          self.activities = activities;
          loader.dismiss();
        });*/

        // self.activities = self.normaliseActivities([{"Activity":{"id":32,"milestone_id":10,"name":"Workshop-1","description":"","video_url":"","order":null,"instructions":"","is_locked":false,"start":"2017-03-07 13:00:02","end":"2017-03-14 12:59:59","deadline":"2017-03-14 12:59:59"},"ActivitySequence":[{"id":70,"activity_id":32,"model":"Assess.Assessment","model_id":29,"order":0,"is_locked":false,"Assess.Assessment":{"id":29,"name":"Check-in 1","description":"Needs a description...","assessment_type":"checkin","is_live":true,"is_team":false,"score_type":"numeric","experience_id":2,"program_id":5,"deleted":false,"deleted_date":null,"comparison_group_size":3,"comparison_group_points":10,"review_period":72,"review_scope":"assessment","review_scope_id":null,"created":"2016-06-23 06:07:39.681326","modified":"2017-03-09 00:18:25","review_instructions":null,"is_repeatable":false,"num_reviews":null,"review_type":null,"review_role":null,"assign_team_mentors":null,"parent_id":null}}]},
        // {
        //     "Activity":{
        //       "id":33,
        //       "milestone_id":10,
        //       "name":"Workshop-2",
        //       "description":"",
        //       "video_url":"",
        //       "order":null,
        //       "instructions":"",
        //       "is_locked":false,
        //       "start":"2017-03-14 13:00:03",
        //       "end":"2017-03-21 12:59:59",
        //       "deadline":"2017-03-21 12:59:59"
        //     },"ActivitySequence":[
        //       {
        //         "id":71,
        //         "activity_id":33,
        //         "model":"Assess.Assessment",
        //         "model_id":30,
        //         "order":0,
        //         "is_locked":false,
        //         "Assess.Assessment":{"id":30,
        //         "name":"Check-in 2",
        //         "description":"Needs a description...",
        //         "assessment_type":"checkin",
        //         "is_live":true,
        //         "is_team":false,
        //         "score_type":"numeric",
        //         "experience_id":2,
        //         "program_id":5,
        //         "deleted":false,
        //         "deleted_date":null,
        //         "comparison_group_size":3,
        //         "comparison_group_points":10,
        //         "review_period":72,
        //         "review_scope":"assessment",
        //         "review_scope_id":null,
        //         "created":"2016-06-23 06:07:39.681326",
        //         "modified":"2017-03-09 00:21:02",
        //         "review_instructions":null,
        //         "is_repeatable":false,
        //         "num_reviews":null,
        //         "review_type":null,
        //         "review_role":null,
        //         "assign_team_mentors":null,
        //         "parent_id":null
        //       }
        //     }]
        //   },
        //   {"Activity":{"id":34,"milestone_id":10,"name":"Workshop 3","description":"Event ah....","video_url":"","order":null,"instructions":"Testing workshop!","is_locked":false,"start":"2017-03-07 13:00:01","end":"2018-03-07 12:59:59","deadline":"2018-03-07 12:59:59"},"ActivitySequence":[{"id":72,"activity_id":34,"model":"Story.Topic","model_id":25,"order":0,"is_locked":false,"Story.Topic":{"id":25,"program_id":5,"title":"Whoooooo~","summary":"Summary~ short short~","videolink":"","created":"2016-06-23 06:07:39.681326","modified":"2017-06-05 08:02:15","story_type":"topic","feature_image_id":null,"author_id":1,"has_comments":true,"tags":"","slug":"whoooooo","collaboration_id":null,"comments":0,"experience_id":2,"assessment_id":null,"view_time":"0.5","parent_id":null,"has_attachment":true}}]}]);

        self.activities = self.normaliseActivities([
            {
                "Activity": {
                    "id": 22,
                    "milestone_id": 9,
                    "name": "Job Smart Foundational experience - orientation ",
                    "description": "Explore what happens in Job Smart, program structure and rewards. Hear about what employers look for in recruitment and what are the stages, processes related to recruitment.\r\nNote:: activity selfie checkin, initial survey to be done only at the end of session itself. Please DO NOT do this before session.",
                    "video_url": "",
                    "order": null,
                    "instructions": "",
                    "is_locked": false,
                    "start": "2016-10-22 13:00:02",
                    "end": "2016-11-01 12:59:59",
                    "deadline": "2016-11-01 12:59:59"
                },
                "ActivitySequence": [
                    {
                        "id": 52,
                        "activity_id": 22,
                        "model": "Assess.Assessment",
                        "model_id": 19,
                        "order": 0,
                        "is_locked": false,
                        "Assess.Assessment": {
                            "id": 19,
                            "name": "Check-In Workshop 1",
                            "description": "Check in to your first workshop here<br>",
                            "assessment_type": "checkin",
                            "is_live": true,
                            "is_team": false,
                            "score_type": "numeric",
                            "experience_id": 2,
                            "program_id": 4,
                            "deleted": false,
                            "deleted_date": null,
                            "comparison_group_size": 3,
                            "comparison_group_points": 10,
                            "review_period": 72,
                            "review_scope": "assessment",
                            "review_scope_id": null,
                            "created": "2016-02-01 04:45:21.573033",
                            "modified": "2016-10-25 23:54:22",
                            "review_instructions": null,
                            "is_repeatable": false,
                            "num_reviews": null,
                            "review_type": null,
                            "review_role": null,
                            "auto_assign_reviewers": null,
                            "parent_id": null,
                            "auto_publish_reviews": false
                        }
                    }
                ]
            },
            {
                "Activity": {
                    "id": 23,
                    "milestone_id": 9,
                    "name": "Initial employability skills self-rating",
                    "description": "Self rate your skills at initial stage of Job Smart - this will be explained and done during session-1time itself",
                    "video_url": "",
                    "order": null,
                    "instructions": "",
                    "is_locked": false,
                    "start": "2016-10-22 13:00:03",
                    "end": "2016-10-30 12:59:59",
                    "deadline": "2016-10-30 12:59:59"
                },
                "ActivitySequence": [
                    {
                        "id": 53,
                        "activity_id": 23,
                        "model": "Assess.Assessment",
                        "model_id": 28,
                        "order": 0,
                        "is_locked": false,
                        "Assess.Assessment": {
                            "id": 28,
                            "name": "Job Smart Initial Survey",
                            "description": "This survey is a self-assessment of your employability skills. Be honest with yourself and leave room to improve. In the end of the program, you will be asked the same questions at the end of the program. Please take 5 minutes to reflect on your current state.<br>",
                            "assessment_type": "survey",
                            "is_live": true,
                            "is_team": false,
                            "score_type": "numeric",
                            "experience_id": 2,
                            "program_id": 4,
                            "deleted": false,
                            "deleted_date": null,
                            "comparison_group_size": 3,
                            "comparison_group_points": 10,
                            "review_period": 72,
                            "review_scope": "assessment",
                            "review_scope_id": null,
                            "created": "2016-02-01 04:45:21.573033",
                            "modified": "2016-10-25 23:59:47",
                            "review_instructions": null,
                            "is_repeatable": false,
                            "num_reviews": null,
                            "review_type": null,
                            "review_role": null,
                            "auto_assign_reviewers": null,
                            "parent_id": null,
                            "auto_publish_reviews": false
                        }
                    }
                ]
            },
            {
                "Activity": {
                    "id": 24,
                    "milestone_id": 9,
                    "name": "Practice quiz about top employer preferences",
                    "description": "Watch a short video about top employers and take a quick, easy quiz based on this",
                    "video_url": "",
                    "order": null,
                    "instructions": "",
                    "is_locked": false,
                    "start": "2016-10-22 13:00:04",
                    "end": "2016-11-03 12:59:59",
                    "deadline": "2016-11-03 12:59:59"
                },
                "ActivitySequence": [
                    {
                        "id": 54,
                        "activity_id": 24,
                        "model": "Assess.Assessment",
                        "model_id": 25,
                        "order": 0,
                        "is_locked": false,
                        "Assess.Assessment": {
                            "id": 25,
                            "name": "Job Smart Quiz",
                            "description": "Industry Partner Careers Questionaire<br>",
                            "assessment_type": "quiz",
                            "is_live": true,
                            "is_team": false,
                            "score_type": "numeric",
                            "experience_id": 2,
                            "program_id": 4,
                            "deleted": false,
                            "deleted_date": null,
                            "comparison_group_size": 3,
                            "comparison_group_points": 10,
                            "review_period": 72,
                            "review_scope": "assessment",
                            "review_scope_id": null,
                            "created": "2016-02-01 04:45:21.573033",
                            "modified": "2016-10-25 23:58:39",
                            "review_instructions": null,
                            "is_repeatable": false,
                            "num_reviews": null,
                            "review_type": null,
                            "review_role": null,
                            "auto_assign_reviewers": null,
                            "parent_id": null,
                            "auto_publish_reviews": false
                        }
                    }
                ]
            },
            {
                "Activity": {
                    "id": 25,
                    "milestone_id": 9,
                    "name": "Link profile to LinkedIn closes",
                    "description": "By now, you have guidance and tips to create a professional profile in LinkedIn - create an account, if you already don't have one and link it to your Job Smart profile",
                    "video_url": "",
                    "order": null,
                    "instructions": "",
                    "is_locked": false,
                    "start": "2016-11-01 13:00:05",
                    "end": "2016-11-20 12:59:59",
                    "deadline": "2016-11-20 12:59:59"
                },
                "ActivitySequence": [
                    {
                        "id": 55,
                        "activity_id": 25,
                        "model": "Assess.Assessment",
                        "model_id": 24,
                        "order": 0,
                        "is_locked": false,
                        "Assess.Assessment": {
                            "id": 24,
                            "name": "Link to LinkedIn",
                            "description": "Link your LinkedIn profile by clicking the button.<br>",
                            "assessment_type": "profile",
                            "is_live": true,
                            "is_team": false,
                            "score_type": "numeric",
                            "experience_id": 2,
                            "program_id": 4,
                            "deleted": false,
                            "deleted_date": null,
                            "comparison_group_size": 3,
                            "comparison_group_points": 10,
                            "review_period": 72,
                            "review_scope": "assessment",
                            "review_scope_id": null,
                            "created": "2016-02-01 04:45:21.573033",
                            "modified": "2016-10-25 23:56:20",
                            "review_instructions": null,
                            "is_repeatable": false,
                            "num_reviews": null,
                            "review_type": null,
                            "review_role": null,
                            "auto_assign_reviewers": null,
                            "parent_id": null,
                            "auto_publish_reviews": false
                        }
                    }
                ]
            }
        ]);
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
