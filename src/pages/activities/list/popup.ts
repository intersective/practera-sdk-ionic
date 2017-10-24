import { Component } from '@angular/core';
import { ViewController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

// services
import { AchievementService } from '../../../services/achievement.service';
//Others
import { i18nData } from '../../../app/i18n-en';
import { loadingMessages, errMessages } from '../../../app/messages';

@Component({
  selector: 'activity-list-popup',
  templateUrl: 'popup.html'
})
export class ActivityListPopupPage {

  achievementData: any = null;
  achievementName: string;
  achievementsLoadingErr: any = errMessages.General.loading.load;
  achievementsEmptyDataErr: any = errMessages.Activities.achievements.empty;
  badgeUrl: string;
  description: string;
  enableData: boolean = null;
  loadingMessage: any = loadingMessages.LoadingSpinner.loading;
  points: string;
  unlock_id: any;

  constructor(
    public achievementService: AchievementService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public translationService: TranslateService,
    public viewCtrl: ViewController
  ) {
    this.unlock_id = this.navParams.get('unlock_id');
    // console.log('Unlock id value: ', this.unlock_id);
  }

  ionViewWillEnter(){
    let loader = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    let loadingFailed = this.toastCtrl.create({
      message: this.achievementsLoadingErr,
      duration: 4000,
      position: 'bottom'
    });
    let nothingLoaded = this.toastCtrl.create({
      message: this.achievementsEmptyDataErr,
      duration: 4000,
      position: 'bottom'
    });
    loader.present().then(() => {
      this.achievementService.getAll()
        .subscribe(
          (data) => {
            if (data.length > 0) {
              this.enableData = true;
              this.achievementData = data.find(res => res.Achievement.id === this.unlock_id).Achievement;
              this.achievementName = this.achievementData.name;
              this.badgeUrl = this.achievementData.badge;
              this.description = this.achievementData.description;
              this.points = this.achievementData.points;
              loader.dismiss().then(() => {
                console.log(this.achievementData);
              });
            } else {
              this.enableData = false;
              loader.dismiss().then(() => {
                nothingLoaded.present();
              });
            }
          },
          (err) => {
            this.enableData = false;
            loader.dismiss().then(() => {
              loadingFailed.present();
            });
          }
        )
    });
  }
  // close disbaled activity popup
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
