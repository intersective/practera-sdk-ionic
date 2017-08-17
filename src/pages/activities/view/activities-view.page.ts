import { Component } from '@angular/core';
import { ModalController, NavParams, NavController } from 'ionic-angular';
import { TranslationService } from '../../../shared/translation/translation.service';
// pages
import { ActivitiesViewModalPage } from './activities-view-modal.page';
// import { AssessmentsPage } from '../../assessments/assessment.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { ActivityService } from '../../../services/activity.service';

import * as _ from 'lodash';
@Component({
  templateUrl: './view.html'
})
export class ActivitiesViewPage {
  activity: any = {};
  assessments: Array<any>;
  submissions: Array<any> = [];
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    public translationService: TranslationService,
    private activityService: ActivityService
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

    console.log("Specific Activity Data, ", this.activity);
    this.activity.badges = [];
    this.submissions = [];
    console.log(this.activity);
  }
  /**
   * @description display activity detail modal page
   */
  openModal() {
    let detailModal = this.modalCtrl.create(ActivitiesViewModalPage, {activity: this.activity});
    detailModal.present();
  }
  /**
   * @TODO 2017_07_04: ISDK-10, we'll be using first assessment from the list
   * @description direct to assessment page of a selected activity
   * @param {Object} activity single activity object from the list of
   * activities respond from get_activities API
   */
  goAssessment(activity) {
    this.navCtrl.push(AssessmentsPage, {activity, assessment: this.assessments[0]});
  }
}
