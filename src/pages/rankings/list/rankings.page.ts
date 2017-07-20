import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { TranslationService } from '../../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../../app/messages'; 
import * as _ from 'lodash';
// services
import { AuthService } from '../../../services/auth.service';
// pages
import { RankingDetailsPage } from '../view/ranking-details.page';
@Component({
  selector: 'rankings-list-page',
  templateUrl: 'rankings.html'
})
export class RankingsPage {
  // fake data and later will be replaced by all user points api call 
  rankingsFakeData: any = [
    {
      "name": "Tom",
      "score": "100000"
    },
    {
      "name": "Jerry",
      "score": "90000"
    },
    {
      "name": "Erica",
      "score": "8000"
    },
    {
      "name": "Erlich",
      "score": "700"
    },
    {
      "name": "Richard",
      "score": "60"
    },
    {
      "name": "Hoffman",
      "score": "50"
    },
    {
      "name": "Kerry",
      "score": "40"
    },
    {
      "name": "Emily",
      "score": "30"
    },
    {
      "name": "wahaha",
      "score": "20"
    },
    {
      "name": "Larry",
      "score": "10"
    },
    {
      "name": "Joseph",
      "score": "0"
    },
    {
      "name": "Austin",
      "score": "0"
    },
    {
      "name": "Ben",
      "score": "0"
    }
  ];
  private currentUserName: string = "User";
  public foundData: any;
  public userScore: number;
  public userRanking: number; 
  public loadingMessages: any = loadingMessages.LoadingSpinner.loading;
  public emptyErrorMessage: any = errMessages.General.loading.load;
  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private authService: AuthService,){
                this.findMyRankingData();
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
  findMyRankingData(){
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: this.loadingMessages
    });
    const emptyDataAlert = this.alertCtrl.create({
      title: 'Sorry, No data has been found',
      message: this.emptyErrorMessage,
      buttons: ['Close']
    });
    loading.present();
    this.authService.getUser()
        .subscribe(
          data => {
            if(data.User.name){
              this.currentUserName = data.User.name;
              loading.dismiss().then(() => {
                this.foundData = _.find(this.rankingsFakeData, (data) => {
                  return data.name == this.currentUserName;
                });
                this.userScore = this.foundData.score;
                this.userRanking = _.indexOf(this.rankingsFakeData, this.foundData) + 1;
              });
            }else {
              loading.dismiss().then(() => {
                this.currentUserName = 'User';
              });
            }
            console.log("Current User Name: ", this.currentUserName);
          },
          err => {
            loading.dismiss().then(() => {
              emptyDataAlert.present();
              console.log(err);
            });
          }
        );
  }
  goRankingDetail(){
    this.navCtrl.push(RankingDetailsPage);
  }
}
