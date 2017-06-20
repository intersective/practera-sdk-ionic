import { Component } from '@angular/core';
import { ModalController, NavParams, NavController } from 'ionic-angular';
import { ActivitiesViewModalPage } from './activities-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessment.page';

@Component({
  templateUrl: './view.html'
})

export class ActivitiesViewPage {
  activity: any = {};

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
  }

  ionViewDidEnter(): void {
    this.activity = this.navParams.get('activity');
    console.log(this.activity);
  }

  openModal() {
    let detailModal = this.modalCtrl.create(ActivitiesViewModalPage, {activity: this.activity});
    detailModal.present();
  }

  // go first Assessment
  goAssessment(activity) {
    this.navCtrl.push(AssessmentsPage, {activity});
  }
}
