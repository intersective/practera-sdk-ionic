import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

      <ion-card *ngIf="activityData.video_url">
        <ion-card-content>
          <video controls width="100%" height="100%">
            <source [src]='resourceUrl' autostart="false">
          </video>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})

export class ActivitiesViewModalPage {
  activity: any = {};
  activityData: {
    name?: string;
    video_url?: string;
    content?: string;
    description?: string;
  } = {};

  resourceUrl: SafeResourceUrl = null;

  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public santitizer: DomSanitizer
  ) {
  }

  ionViewDidEnter(): void {
    this.activity = this.navParams.get('activity');
    this.activityData = this.activity.Activity;
    if (this.activityData) {
      this.resourceUrl = this.santitizer.bypassSecurityTrustResourceUrl(this.activityData.video_url) || null;
    }
    console.log(this.activity.Activity);
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

}
