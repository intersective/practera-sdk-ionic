import { Component } from '@angular/core';
import { ModalController, NavParams, NavController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
// pages
import { ActivitiesViewModalPage } from './activities-view-modal.page';
// import { AssessmentsPage } from '../../assessments/assessment.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { ActivityService } from '../../../services/activity.service';
import { SubmissionService } from '../../../services/submission.service';

import * as _ from 'lodash';
@Component({
  templateUrl: './view.html'
})
export class ActivitiesViewPage {
  activity: any = {};
  assessment: any = {};
  assessments: any = {};
  submissions: Array<any> = [];
  achievements: any = {
    available: [],
    obtained: {},
    maxPoints: {}
  };
  loadings = {
    submissions: false
  };

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private activityService: ActivityService,
    private submissionService: SubmissionService,
    private alertCtrl: AlertController
  ) {
  }


  // @TODO: use simple mock data for assessment first
  /**
   * on assessment implementation, to do list:
   * - load badges
   * - change icon display based on responded data format
   * - load submission into this.submissions
   * - change template view based on responded data format
   */
  ionViewDidEnter(): void {
    this.loadings.submissions = true;

    // assessment
    this.activity = this.activityService.normaliseActivity(this.navParams.get('activity') || {});
    this.assessments = this.activity.sequences || [];
    this.assessment = this.activity.assessment;


    // submission
    this.submissions = [];
    Observable.forkJoin(this.getSubmissions()).subscribe(responses => {
      // turn nested array into single dimension array
      responses.forEach((submissions: Array<any>) => {
        if (submissions.length > 0) {
          this.submissions = submissions.map(submission => {
            return this.submissionService.normalise(submission);
          });
        }
      });

      console.log(this.submissions);
      this.loadings.submissions = false;
    });

    // badges
    this.achievements = this.navParams.get('achievements');
    this.activity.badges = this.extractBadges();
    this.activity.badges.map((badge, index) => {
      if ((this.activity.id % 3) != 0) {
        badge.disabled = false;
      } else {
        badge.disabled = true;
      }
    });
  }

  private getSubmissions() {
    let tasks = []; // multiple API requests

    // get_submissions API to retrieve submitted answer
    let getSubmissions = (contextId) => {
      return this.submissionService.getSubmissions({
        search: {
          context_id: contextId
        }
      });
    };

    // Congregation of get_submissions API Observable with different context_id
    _.forEach(this.activity.References, (reference) => {
      if (reference.context_id) {
        return tasks.push(getSubmissions(reference.context_id));
      }
    });

    return tasks;
  }

  // extract "in progress"
  inProgressSubmission() {
    let result = [];
    (this.submissions || []).forEach(submission => {
      if (submission.status === 'in progress') {
        result.push(submission);
      }
    });
    return result;
  }

  private extractBadges(): Array<any> {
    let result = [];
    if (this.achievements.available && this.achievements.available.length > 0) {
      this.achievements.available.forEach(achievement => {
        if (achievement.Achievement.badge) {
          result.push({
            url: achievement.Achievement.badge,
            disabled: false
          });
        }
      });
    }
    return result;
  }

  /**
   * @description display activity detail modal page
   */
  openModal() {
    let detailModal = this.modalCtrl.create(ActivitiesViewModalPage, {activity: this.activity});
    detailModal.present();
  }

  /**
   * @name goAssessment
   * @description direct to assessment page of a selected activity
   * @param {Object} activity single activity object from the list of
   *                          activities respond from get_activities API
   * @param {Object} opts optional object with
   *                 - hasSubmission: to indicateif user is accessing a in
   *                   progress assessment
   */
  goAssessment(activity, opts = { hasSubmission: false }) {
    if ((this.inProgressSubmission()).length > 0 && opts.hasSubmission === false) {
      let alert = this.alertCtrl.create({
        title: 'You have a submission in progress.',
        buttons: ["Ok"]
      });
      alert.present();
    } else {
      let inProgress = _.find(this.submissions, {status: 'in progress'});

      this.navCtrl.push(AssessmentsPage, {
        activity,
        assessment: this.assessment,
        submissions: this.submissions,
        inProgress
      });
    }
  }
}
