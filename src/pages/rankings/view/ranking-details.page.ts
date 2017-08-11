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
  public achievementPoint = 0;
  public totalPoints = 0;
  public monthlyPoints = 0;
  public currentMonth = moment().month() + 1;
  public currentMonthData: any = [];
  // public isEmpty: boolean = false;
  public emptyAchievementMessage = errMessages.Activities.achievements.empty;
  public loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  public emptyErrorMessage: any = errMessages.General.loading.load;
  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private achievementService: AchievementService){}
  ionViewWillEnter(){
    this.userAchievements();
  }
  userAchievements(){
    // const emptyDataAlert = this.alertCtrl.create({
    //   title: 'Oops! No data has been found',
    //   message: this.emptyErrorMessage,
    //   buttons: ['Close']
    // });
    this.achievementService.getAchievements()
    .subscribe(
      data => {
        console.log("Total achievemnts: ", data);
        console.log("Total achievemnts length : ", data.length);
        this.monthlyPoints = 0;
        this.totalPoints = 0;

        if(data.length !== 0) {
          // everytime when loading ranking details page, the total points needs to be same as previous unless user got new achievements.
          // this.userAchievementsData = data.Achievement;
          _.forEach(data.Achievement, element => {
            if(element.visibility !== 2){
              this.userAchievementsData.push(element);
            }
          });
          _.forEach(this.userAchievementsData, element => {
            this.totalPoints += element.points;
          });
          this.currentMonthData = _.filter(this.userAchievementsData, (monthData) => {
            (moment(monthData.earned).month() + 1) == this.currentMonth;
          });
          if (this.currentMonthData.length != 0) {
            this.userAchievementsData.forEach(element => {
              this.monthlyPoints += element.points;
            });
          } else {
            this.monthlyPoints = 0;
          }
        }
      },
      err => {
        this.monthlyPoints = 0;
        this.totalPoints = 0; // if data arary (data.Achievement) loading connection error occurred
        // this.isEmpty = true;
        console.log("Error: ", err);
        // emptyDataAlert.present();
      }
    );
  }
  goToBadgeDetailsPage(achievementData){
    let goRankingBadgesPopup = this.modalCtrl.create(RankingBadgesPage, { achievement: achievementData });
    goRankingBadgesPopup.present();
  }
}
