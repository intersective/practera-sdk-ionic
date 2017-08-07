import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { TranslationService } from '../../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../../app/messages'; 
import * as _ from 'lodash';
// services
import { RankingService } from '../../../services/ranking.service';
// pages
import { RankingDetailsPage } from '../view/ranking-details.page';
@Component({
  selector: 'rankings-list-page',
  templateUrl: 'rankings.html'
})
export class RankingsPage {
  public totalData: any = [];
  public rankingData: any = [];
  public myRankingData: any = [];
  public listRankingData: any = [];
  public isEmptyList: boolean = false;
  public rankingListEmpty: any = errMessages.General.empty.empty;
  public loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  public emptyErrorMessage: any = errMessages.General.loading.load;
  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private rankingService: RankingService){}
  ionViewWillEnter(){
    this.RankingData();
  }
  RankingData(){
    const loading = this.loadingCtrl.create({
      content: this.loadingMessages
    });
    const emptyDataAlert = this.alertCtrl.create({
      title: 'Sorry, No data has been found',
      message: this.emptyErrorMessage,
      buttons: ['Close']
    });
    loading.present();
    let getRankingList = this.rankingService.getRankings();   
    getRankingList.subscribe(
      results => {
        loading.dismiss().then(() => {
          this.totalData = results;
          this.rankingData = this.totalData;
          this.myRankingData = this.totalData.Me;
          this.listRankingData = this.totalData.Characters;
          // console.log(this.myRankingData);
          // console.log(this.listRankingData);
          _.forEach(this.listRankingData, (element, index) => {
            if(element.meta != null && element.meta.indexOf('true') > -1){
              // element.name = "User"+(index+1);
              element.name = "Hidden Name";
              // console.log("Hidden Name: ", element.name);
            }
            this.isEmptyList = false;
          });
        });
      },
      err => {
        loading.dismiss().then(() => {
          this.isEmptyList = true;
          // this.rankingListEmpty = err.msg;
          console.log("Error: ", err.msg);
          emptyDataAlert.present();
        });
      }
    );
  }
  goRankingDetail(){
    this.navCtrl.push(RankingDetailsPage);
  }
}
