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
        <ion-title>{{ achievementData.name || 'Unlocked' }}</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content class="ahievements-popup">
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="popup-contents">
              <img class="badge-image" src="{{ achievementData.badge || badgeUrl }}" alt="Badge Image"/>
              <p>{{ achievementData.description || description }}</p>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class ActivityAchievementModalPage {
  public achievementData: any = {};
  public badgeUrl: string = './assets/img/badges/badge7.svg';
  public description: string = "No Description Yet ..";
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController
  ) {}
  ionViewDidEnter(): void {
    this.achievementData = this.navParams.get('achievementData');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
