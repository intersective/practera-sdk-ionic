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
  currentAchievement: any = null;
  badgeUrl: string = '../assets/img/default/default-badge.png';
  description: string = "No Description Yet ..";
  points: number = 0;
  achievementName: string = "Achievement";
  loadingMessage: any = loadingMessages.LoadingSpinner.loading;
  achievementsLoadingErr: any = errMessages.General.loading.load;
  achievementsEmptyDataErr: any = errMessages.Activities.achievements.empty;

  constructor(private viewCtrl: ViewController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private achievementService: AchievementService,
              private translationService: TranslationService){
                this.currentAchievement = this.navParams.get('achievement');
                console.log("currentAchievement: ", this.currentAchievement);
              }

  // close disbaled activity popup
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
