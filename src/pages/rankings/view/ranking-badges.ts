import { Component } from '@angular/core';
import { ViewController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { TranslationService } from '../../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../../app/messages'; 
import * as _ from 'lodash';
// services
import { AchievementService } from '../../../services/achievement.service';
// pages
import { RankingDetailsPage } from '../view/ranking-details.page';
@Component({
  selector: 'ranking-badges',
  templateUrl: 'ranking-badges.html'
})
export class RankingBadgesPage {
  public currentAchievement: any = null;
  public badgeUrl: string = '../assets/img/default/default-badge.png';
  public imageURL: string = '';
  public description: string = "No Description Yet ..";
  public points: number = 0;
  public achievementName: string = "Achievement";
  public loadingMessage: any = loadingMessages.LoadingSpinner.loading;
  public achievementsLoadingErr: any = errMessages.General.loading.load;
  public achievementsEmptyDataErr: any = errMessages.Activities.achievements.empty;
  constructor(private viewCtrl: ViewController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private achievementService: AchievementService,
              public translationService: TranslationService){
                this.currentAchievement = this.navParams.get('achievement');
                if(this.currentAchievement.badge){
                  this.imageURL = this.currentAchievement.badge;
                }else {
                  if(this.currentAchievement.meta.image){
                    this.imageURL = this.currentAchievement.meta.image;
                  }else {
                    this.imageURL = this.badgeUrl;  
                  }
                }
              }
  // close disbaled activity popup
  closeModal() {
    this.viewCtrl.dismiss();
  }
}