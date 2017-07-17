import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
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
      "score": "100"
    },
    {
      "name": "Jerry",
      "score": "90"
    },
    {
      "name": "Erica",
      "score": "80"
    },
    {
      "name": "Erlich",
      "score": "70"
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
  public loginLoadingMessages: any = loadingMessages.Login.login;
  constructor(private navCtrl: NavController,
              private loadingCtrl: LoadingController,
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
      content: this.loginLoadingMessages
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
              this.currentUserName = 'User';
            }
            console.log(this.currentUserName);
          },
          err => {
            console.log(err);
          }
        );
  }
  goRankingDetail(){
    this.navCtrl.push(RankingDetailsPage);
  }
}
