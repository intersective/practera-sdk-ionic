import { Component } from '@angular/core';
import { ModalController, NavParams, NavController } from 'ionic-angular';
import { TranslationService } from '../../../shared/translation/translation.service';
// pages
import { ActivitiesViewModalPage } from './activities-view-modal.page';
// import { AssessmentsPage } from '../../assessments/assessment.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { ActivityService } from '../../../services/activity.service';
import { SubmissionService } from '../../../services/submission.service';
import { AchievementService } from '../../../services/achievement.service';

import * as _ from 'lodash';
@Component({
  templateUrl: './view.html'
})
export class ActivitiesViewPage {
  activity: any = {};
  assessment: any = {};
  submissions: Array<any> = [];
  achievements: any = {
    available: [],
    obtained: {},
    maxPoints: {}
  };

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    public translationService: TranslationService,
    private activityService: ActivityService,
    private submissionService: SubmissionService,
    private achievementService: AchievementService
  ) {}

  // @TODO: use simple mock data for assessment first
  /**
   * on assessment implementation, to do list:
   * - load badges
   * - change icon display based on responded data format
   * - load submission into this.submissions
   * - change template view based on responded data format
   */
  ionViewDidEnter(): void {

    this.activity = this.activityService.normaliseActivity(this.navParams.get('activity') || {});
    this.assessments = this.activity.sequences || [];

    this.assessment = this.activity.assessment;

    this.submissions = [];
    this.submissionService.getSubmissions({
      search: { context_id: this.assessment.context_id }
    }).subscribe(response => {
      if (response.length > 0) {
        console.log(this.submissions);
        this.submissions = response.map(submission => {
          return this.submissionService.normalise(submission);
        });
        console.log(this.submissions);
      }
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
   */
  goAssessment(activity) {
    let inProgress = _.find(this.submissions, {status: 'in progress'});

    this.navCtrl.push(AssessmentsPage, {
      activity,
      assessment: this.assessment,
      submissions: this.submissions,
      inProgress
    });
  }
}
