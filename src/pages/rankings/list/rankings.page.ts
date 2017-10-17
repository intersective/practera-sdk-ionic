import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { TranslationService } from '../../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../../app/messages';
import * as _ from 'lodash';
// services
import { GameService } from '../../../services/game.service';
import { CacheService } from '../../../shared/cache/cache.service';
// pages
import { RankingDetailsPage } from '../view/ranking-details.page';
@Component({
  selector: 'rankings-list-page',
  templateUrl: 'rankings.html'
})
export class RankingsPage {
  totalData: any = [];
  rankingData: any = [];
  myRankingData: any = [];
  listRankingData: any = [];
  loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  emptyErrorMessage: any = errMessages.General.loading.load;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public gameService: GameService,
              public cacheService: CacheService){}

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
    // @TODO remove later
    let gameId = this.cacheService.getLocalObject('game_id');
    this.gameService.getCharacters(gameId)
      .subscribe((characters) => {
        // Now only have one character per project
        let me = characters.Characters[0];
        this.gameService.getRanking(gameId, me.id)
          .subscribe(
            results => {
              loading.dismiss().then(() => {
                this.totalData = results;
                this.rankingData = this.totalData;
                // We only have 1 character
                if(this.totalData.MyCharacters){
                  this.myRankingData = this.totalData.MyCharacters[0] || [];
                }else {
                  this.myRankingData = [];
                }
                this.listRankingData = this.totalData.Characters;
              });
            },
            err => {
              loading.dismiss().then(() => {
                console.log('err', err);
                emptyDataAlert.present();
              });
            }
          );
      },
      err => {
        loading.dismiss().then(() => {
          console.log('Error: ', err.msg);
          emptyDataAlert.present();
        });
      });
  }

  goRankingDetail(myRanking){
    this.navCtrl.push(RankingDetailsPage, {
      myRanking: myRanking
    });
  }
}
