import { Component } from '@angular/core';
import { ModalController, NavParams, NavController } from 'ionic-angular';
import { ActivitiesViewModalPage } from './activities-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessment.page';

@Component({
  templateUrl: './view.html'
})

export class ActivitiesViewPage {
  activity: any = {};
  submissions: Array<any> = [];

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController
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
    this.activity = this.navParams.get('activity');
    this.activity.badges = [
      {url: 'http://leevibe.com/images/category_thumbs/video/19.jpg'},
      {url: 'http://mobileapp.redcross.org.uk/achievements/heart-icon.png'},
      {url: 'http://americanredcross.3sidedcube.com/media/45334/fire-large.png'},
    ];
    this.submissions = this.navParams.get('submissions') || [
      {
        title: 'Submission 1',
        status: 'Pending Review'
      }
    ];
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
   * @description direct to assessment page of a selected activity
   * @param {Object} activity single activity object from the list of 
   * activities respond from get_activities API
   */
  goAssessment(activity) {
    this.navCtrl.push(AssessmentsPage, {activity});
  }
}
