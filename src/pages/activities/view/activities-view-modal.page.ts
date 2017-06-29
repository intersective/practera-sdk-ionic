import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-buttons start>
          <button ion-button icon-only (click)="dismiss()">
            <ion-icon name="close"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>{{activityData.name}}</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <ion-list>
        <h2>{{ activityData.name }}</h2>

        <div [innerHtml]="activity.content"></div>

        <p>{{ activityData.description || 'No descriptions available.' }}</p>
      </ion-list>

      <ion-list *ngIf="activityData.video_url">
        <iframe width="640" height="390" [src]="activityData.video_url" frameborder="0" allowfullscreen></iframe>
        <a ion-button full [href]="activityData.video_url">Download</a>
      </ion-list>
    </ion-content>
  `
})

export class ActivitiesViewModalPage {
  activity: any = {};
  activityData: Object = {};
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
  }

  ionViewDidEnter(): void {
    this.activity = this.navParams.get('activity');
    this.activityData = this.activity.Activity;
    console.log(this.activity.Activity);
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
}
