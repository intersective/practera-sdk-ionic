import { Component } from '@angular/core';
import { ViewController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { i18nData } from '../../../app/i18n-en';
import { loadingMessages, errMessages } from '../../../app/messages';
// services
import { AchievementService } from '../../../services/achievement.service';

@Component({
  selector: 'activity-list-popup',
  templateUrl: 'popup.html'
})
export class ActivityListPopupPage {
  private unlock_id: any;
  private achievementData: any = null;
  private badgeUrl: string;
  private description: string;
  private points: string;
  private achievementName: string;
  private enableData: boolean = null;
  private loadingMessage: any = loadingMessages.LoadingSpinner.loading;
  private achievementsLoadingErr: any = errMessages.General.loading.load;
  private achievementsEmptyDataErr: any = errMessages.Activities.achievements.empty;

  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private achievementService: AchievementService,
    private translationService: TranslateService
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
          data => {
            if(data.length > 0){
              this.enableData = true;
              this.achievementData = data.find(res => res.Achievement.id === this.unlock_id).Achievement;
              this.achievementName = this.achievementData.name;
              this.badgeUrl = this.achievementData.badge;
              this.description = this.achievementData.description;
              this.points = this.achievementData.points;
              loader.dismiss().then(() => {
                console.log(this.achievementData);
              });
            }else {
              this.enableData = false;
              loader.dismiss().then(() => {
                nothingLoaded.present();
              });
            }
          },
          err => {
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
