import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  template: `
    <ion-content padding>
      <ion-card>
        <ion-card-header>
          {{spinner.name}}
        </ion-card-header>

        <ion-card-content>
          <ion-card-title>
            Prize
          </ion-card-title>

          <div [innerHtml]="spinner.content"></div>

          <p class="text-center" *ngIf="spinner.description">
            {{ spinner.description }}
          </p>
        </ion-card-content>
      </ion-card>

      <ion-list>
        <button ion-button outline block (click)="dismiss()">Close</button>
      </ion-list>
    </ion-content>
  `
})

export class SpinwheelModalPage {
  spinner: any = {};
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {}

  ionViewDidEnter(): void {
    this.spinner = this.navParams.get('spinner');
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }
}
