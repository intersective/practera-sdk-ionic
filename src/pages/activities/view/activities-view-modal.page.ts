import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
@Component({
  selector: 'activities-view-model',
  templateUrl: 'activities-view-model.html'
})
export class ActivitiesViewModalPage {
  videoUrl: SafeResourceUrl;
  public activity: any = [];
  public activityData: any = [];
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private domSanitizer: DomSanitizer
  ) {
    this.activity = this.navParams.get('activity');
    this.activityData = this.activity;
    this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.activityData.video_url);
  }
  ionViewDidEnter(): void {
  }
  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
}
