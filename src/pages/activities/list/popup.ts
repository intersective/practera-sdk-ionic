import { Component, Injectable } from '@angular/core';
import { ViewController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { i18nData } from './assets/i18n-en'; 
import { loadingMessages, errMessages } from '../../../app/messages'; 
// services
import { AchievementService } from '../../../services/achievement.service';
@Injectable()
@Component({
  selector: 'activity-list-popup',
  templateUrl: 'popup.html' 
})
export class ActivityListPopupPage {
  public unlock_id: any;
  public achievementData: any = null;
  public badgeUrl: string;
  public description: string;
  public points: string;
  public achievementName: string;
  public enableData: boolean = null;
  public loadingMessage: any = loadingMessages.LoadingSpinner.loading;
  public achievementsLoadingErr: any = errMessages.General.loading.load;
  public achievementsEmptyDataErr: any = errMessages.Activities.achievements.empty;
  constructor(private viewCtrl: ViewController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private achievementService: AchievementService,
              private translate: TranslateService){
                this.unlock_id = this.navParams.get('unlock_id');
                // console.log('Unlock id value: ', this.unlock_id);
                translate.addLangs(["en"]);
                translate.setDefaultLang('en');
                translate.use('en');
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
      this.achievementService.getAllAchievements()
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