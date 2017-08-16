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
              private gameService: GameService,
              private cacheService: CacheService){}
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
                console.log(results);
                this.totalData = results;
                this.rankingData = this.totalData;
                this.myRankingData = this.totalData.My_Character;
                this.listRankingData = this.totalData.Characters;
                console.log(this.myRankingData);
                console.log(this.listRankingData);
                _.forEach(this.listRankingData, (element, idx) => {
                  if(element.meta && element.meta.private === 1) {
                    this.listRankingData[idx].name = 'Hidden Name';
                  }
                  this.isEmptyList = false;
                });
              });
            },
            err => {
              loading.dismiss().then(() => {
                this.isEmptyList = true;
                // this.rankingListEmpty = err.msg;
                console.log('Error: ', err.msg);
                emptyDataAlert.present();
              });
            }
          );
      },
      err => {
        loading.dismiss().then(() => {
          this.isEmptyList = true;
          // this.rankingListEmpty = err.msg;
          console.log('Error: ', err.msg);
          emptyDataAlert.present();
        });
      });
  }
  goRankingDetail(){
    this.navCtrl.push(RankingDetailsPage);
  }
}
