import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { TranslationService } from '../../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../../app/messages'; 
import * as _ from 'lodash';
import * as moment from 'moment';
// services
import { AchievementService } from '../../../services/achievement.service';
// pages 
import { RankingBadgesPage } from './ranking-badges.page';
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
  public loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  public emptyErrorMessage: any = errMessages.General.loading.load;
  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private achievementService: AchievementService){
                this.getUserAchievementData();
                console.log("Current month: ", this.currentMonth);
              }
  doRefresh(e) {
    // this.loadEvents()
    // .then(() => {
    //   e.complete();
    // })
    // .catch((err) => {
    //   console.log('err', err);
    //   e.complete();
    // });
  }
  getUserAchievementData(){
    const loading = this.loadingCtrl.create({
      content: this.loadingMessages
    });
    const emptyDataAlert = this.alertCtrl.create({
      title: 'Oops! No data has been found',
      message: this.emptyErrorMessage,
      buttons: ['Close']
    });
    loading.present();
    this.achievementService.getAchievements()
        .subscribe(
          data => {
            if(data.Achievement){
              console.log("total data: ", data);
              this.monthlyPoints = 0; 
              this.totalPoints = 0; 
              // everytime when loading ranking details page, the total points needs to be same as previous unless user got new achievements.  
              // this.userAchievementsData = data.Achievement; 
              data.Achievement.forEach(element => {
                if(element.visibility !== 2){
                  this.userAchievementsData.push(element);
                  console.log("total filtered data: ", this.userAchievementsData);
                }
              });
              loading.dismiss().then(() => {
                this.userAchievementsData.forEach(element => {
                  this.totalPoints += element.points;
                });
                this.currentMonthData = _.filter(this.userAchievementsData, (monthData) => {
                  return (moment(monthData.earned).month() + 1) == this.currentMonth;
                });
                if(this.currentMonthData.length != 0){
                  this.userAchievementsData.forEach(element => {
                    this.monthlyPoints += element.points;
                  });
                }else {
                  this.monthlyPoints = 0;
                }
                console.log('Monthly Data: ', this.currentMonthData);
                console.log('Monthly Data Total Points: ', this.monthlyPoints);
              });
            }else {
              loading.dismiss().then(() => {
                this.monthlyPoints = 0;
                this.totalPoints = 0; // if data arary (data.Achievement) is empty
              });
            }
          },
          err => {
            loading.dismiss().then(() => {
              this.monthlyPoints = 0;
              this.totalPoints = 0; // if data arary (data.Achievement) loading connection error occurred 
              emptyDataAlert.present();
              console.log(err);
            });
          }
        );
  }
  goToBadgeDetailsPage(achievementData){
    this.navCtrl.push(RankingBadgesPage, { achievement: achievementData });
  }
}