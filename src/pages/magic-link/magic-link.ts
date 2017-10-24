import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

// services
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
import { MilestoneService } from '../../services/milestone.service';
// pages
import { TabsPage } from '../tabs/tabs.page';
import { LoginPage } from '../login/login';
// Others
import { loadingMessages, errMessages } from '../../app/messages';
import * as _ from 'lodash';

@Component({
  selector: 'page-magic-link',
  templateUrl: 'magic-link.html'
})
export class MagicLinkPage {
  auth_token: string;
  loginLoadingMessage: any = loadingMessages.Login.login;
  milestone_id: string;
  misMatchTokenErrMessage: any = errMessages.DirectLink.mismatch;
  verifySuccess = null;

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public cacheService: CacheService,
    public gameService: GameService,
    public loadingCtrl: LoadingController,
    public milestoneService: MilestoneService,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

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
    loading.present();
    observable.subscribe(data => {
      // localStorage.setItem('isAuthenticated', 'true');
      // this.navCtrl.push(TabsPage);
      // console.log("Successfully logged in");
      data = data.data;
      this.cacheService.setLocalObject('apikey', data.apikey);
      this.cacheService.setLocalObject('timelineID', data.Timelines[0].Timeline.id);
      this.cacheService.setLocalObject('teams', data.Teams);
      // get game_id data after login
      this.gameService.getGames()
          .subscribe(
            data => {
              console.log("game data: ", data);
              _.map(data, (element) => {
                console.log("game id: ", element[0].id);
                this.cacheService.setLocal('game_id', element[0].id);
              });
            },
            err => {
              console.log("game err: ", err);
            }
          );
      // get milestone data after login
      this.authService.getUser()
        .subscribe(
          data => {
            this.cacheService.setLocalObject('name', data.User.name);
            this.cacheService.setLocalObject('email', data.User.email);
            this.cacheService.setLocalObject('program_id', data.User.program_id);
            this.cacheService.setLocalObject('project_id', data.User.project_id);
          },
          err => {
            console.log(err);
          }
        );
      // get milestone data after login
      this.milestoneService.getMilestones()
        .subscribe(
          data => {
            console.log(data.data[0].id);
            this.milestone_id = data.data[0].id;
            this.cacheService.setLocalObject('milestone_id', data.data[0].id);
            console.log("milestone id: " + data.data[0].id);
            loading.dismiss();
            this.navCtrl.push(TabsPage).then(() => {
              window.history.replaceState({}, '', window.location.origin);
            });
          },
          err => {
            console.log(err);
          }
        )
      this.cacheService.write('isAuthenticated', true);
      this.cacheService.setLocal('isAuthenticated', true);
      },
      err => {
      const failAlert = this.alertCtrl.create({
        title: 'Magic did NOT happen',
        message: this.misMatchTokenErrMessage,
        buttons: ['Close']
      });
      failAlert.present();
        this.navCtrl.push(LoginPage).then(() => {
          window.history.replaceState({}, '', window.location.origin);
        });
        // console.log("Login failed");
        this.cacheService.removeLocal('isAuthenticated');
        this.cacheService.write('isAuthenticated', false);
      });
  }
}
