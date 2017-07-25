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
        <ion-title>{{activity.name}}</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content padding>
      <ion-list>
        <h2>{{ activity.name }}</h2>

        <div [innerHtml]="activity.content"></div>

        <p>{{ activity.description || 'No descriptions available.' }}</p>
      </ion-list>

      <ion-list *ngIf="activity.video_url">
        <iframe width="640" height="390" [src]="activity.video_url" frameborder="0" allowfullscreen></iframe>
      </ion-list>

      <ion-list *ngIf="activity.video_url">
        <a ion-button full [href]="activity.video_url">Download</a>
      </ion-list>

      <ion-list *ngIf="activity.video_url" class="center">
        <video width="100%" height="200" controls>
          <source [src]="activity.video_url" type="{{activity.mimetype}}">
        </video>
      </ion-list>
    </ion-content>
  `
})

export class ActivitiesClassicViewModalPage {
  activity: any = {};

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {
  }

  ionViewDidEnter(): void {
    this.activity = this.navParams.get('activity');
    console.log(this.activity);
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
}
