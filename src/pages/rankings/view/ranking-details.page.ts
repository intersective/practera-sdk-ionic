import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { TranslationService } from '../../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../../app/messages';
import * as _ from 'lodash';
import * as moment from 'moment';
// services
import { AchievementService } from '../../../services/achievement.service';
// pages
import { RankingBadgesPage } from './ranking-badges';
@Component({
  selector: 'rankings-details-page',
  templateUrl: 'ranking-details.html'
})
export class RankingDetailsPage {
  public userAchievementsData: any = [];
  public achievementBadgeImage = '../assets/img/default/default-badge.png';
  public achievementName = 'Achievement';
  public totalPoints = 0;
  public myRank: any= {};

  public emptyAchievementMessage = errMessages.Activities.achievements.empty;
  public loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  public emptyErrorMessage: any = errMessages.General.loading.load;
  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private params: NavParams,
              private achievementService: AchievementService){}
  ionViewWillEnter() {
    let loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.userAchievements()
      .then(() => {
        loader.dismiss();
      }, err => {
        console.log('log::', err);
      });
    });

  }
  userAchievements(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.achievementService.getAchievements()
        .subscribe(
          (data) => {
            console.log('achievemnts', data);
            if (data) {
              // Filter achievemnts
              _.forEach(data.Achievement, element => {
                if(element.visibility !== 2){
                  this.userAchievementsData.push(element);
                }
              });
            }
            resolve();
          },
          (err) => {
            console.log("Error: ", err);
            reject(err);
          }
        );
    });
  }
  goToBadgeDetailsPage(achievementData){
    let goRankingBadgesPopup = this.modalCtrl.create(RankingBadgesPage, { achievement: achievementData });
    goRankingBadgesPopup.present();
  }
}
