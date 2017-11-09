import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
// services
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
import { MilestoneService } from '../../services/milestone.service';
import { TranslationService } from '../../shared/translation/translation.service';
// pages
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs.page';
// Others
import { loadingMessages, errMessages } from '../../app/messages';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
@Component({
  selector: 'page-magic-link',
  templateUrl: 'magic-link.html'
})
export class MagicLinkPage {
  public auth_token: string = null;
  public gameID: string = null;
  public loginLoadingMessage: any = loadingMessages.Login.login;
  public milestone_id: string = null;
  public misMatchTokenErrMessage: any = errMessages.DirectLink.mismatch;
  public userData: any = [];
  public verifySuccess = null;
  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthService,
    public cacheService: CacheService,
    public gameService: GameService,
    public milestoneService: MilestoneService,
    public translationService: TranslationService) {
      this.cacheService.setLocal('gotNewItems', false);
    }
  ionViewDidLoad() {
    this.auth_token = this.navParams.get('auth_token');
  }

  ionViewWillEnter(){
    this.magicLinkAccess();
  }

  magicLinkAccess(){
    let observable = this.authService.magicLinkLogin(this.auth_token);
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: this.loginLoadingMessage
    });
    loading.present().then(() => {
      observable.subscribe(
        data => {
          this.cacheService.setLocal('apikey', data.apikey);
          this.cacheService.setLocal('timelineID', data.Timelines[0].Timeline.id);
          this.cacheService.setLocal('teams', data.Teams);
          let getGame = this.gameService.getGames();
          let getUser = this.authService.getUser();
          let getMilestone = this.milestoneService.getMilestones();
          Observable.forkJoin([getGame, getUser, getMilestone])
            .subscribe(
              results => {
                // results[0] game API data
                this.gameID = results[0].Games[0].id;
                if(this.gameID){
                  this.cacheService.setLocal('game_id', this.gameID);
                }
                // results[1] user API data
                this.userData = results[1];
                if(this.userData){
                  this.cacheService.setLocal('name', results[1].User.name);
                  this.cacheService.setLocal('email', results[1].User.email);
                  this.cacheService.setLocal('program_id', results[1].User.program_id);
                  this.cacheService.setLocal('project_id', results[1].User.project_id);
                  this.cacheService.setLocal('user', results[1].User);
                }
                // results[2] milestone API data
                this.milestone_id = results[2][0].id;
                if(this.milestone_id){
                  this.cacheService.setLocal('milestone_id', this.milestone_id);
                }
                loading.dismiss().then(() => {
                  this.navCtrl.setRoot(TabsPage).then(() => {
                    window.history.replaceState({}, '', window.location.origin); // reformat current url 
                  });
                });
                this.cacheService.write('isAuthenticated', true);
                this.cacheService.setLocal('isAuthenticated', true);
            })  
        },
        err => {
          const failAlert = this.alertCtrl.create({
            title: 'Magic did NOT happen',
            message: this.misMatchTokenErrMessage,
            buttons: ['Close']
          });
          failAlert.present();
          this.navCtrl.setRoot(LoginPage).then(() => {
            window.history.replaceState({}, '', window.location.origin);
          });
          this.cacheService.removeLocal('isAuthenticated');
          this.cacheService.write('isAuthenticated', false);
        }
      )
    })
  }
}
