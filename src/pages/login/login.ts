import { Component, ViewChild } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController,
         ModalController,
         ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages';
// services
import { AuthService } from '../../services/auth.service';
import { MilestoneService } from '../../services/milestone.service';
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
import { RequestServiceConfig } from '../../shared/request/request.service';
// directives
import {FormValidator} from '../../shared/validators/formValidator';
// pages
import { TabsPage } from '../../pages/tabs/tabs.page';
import { ForgetPasswordPage } from '../../pages/forget-password/forget-password';
/* This page is for handling user login process */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email: string;
  password: any;
  userName: string;
  userImage: string;
  API_KEY: string;
  milestone_id: string;
  loginFormGroup: any;
  forgetpasswordPage = ForgetPasswordPage;
  loginLoadingMessages: any = loadingMessages.Login.login;
  invalidLoginMessage: any = errMessages.Login.login;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public authService: AuthService,
    public gameService: GameService,
    public translationService: TranslationService,
    public config: RequestServiceConfig,
    public formBuilder: FormBuilder,
    public milestoneService: MilestoneService,
    public cacheService: CacheService
  ) {
    this.navCtrl = navCtrl;
    this.loginFormGroup = formBuilder.group({
      email: ['', [FormValidator.isValidEmail,
                   Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ionViewCanLeave(): boolean {
    // user is authorized
    console.log('authorized');
    let authorized = true;
    if (authorized){
      return true;
    } else {
      return false;
    }
  }

  /**
   * user login function to authenticate user with email and password
   */
  userLogin() {
    let self = this;
    this.cacheService.clear().then(() => {
      // add loading effect during login process
      const loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: this.loginLoadingMessages
      });
      loading.present().then(() => {
        // This part is calling post_auth() API from backend
        this.authService.loginAuth(this.email, this.password)
            .subscribe(data => {
              self.cacheService.setLocal('apikey', data.apikey);
              // saved for 3 types of timeline id in order for later use
              self.cacheService.setLocal('timelineID', data.Timelines[0].Timeline.id);
              self.cacheService.setLocal('teams', data.Teams);
              self.cacheService.setLocal('gotNewItems', false);
              // get game_id data after login
              this.gameService.getGames()
                  .subscribe(data => {
                    console.log("game data: ", data);
                    if (data && data.Games) {
                      data.Games.map(game => {
                        console.log("game id: ", game.id);
                        if (game && game.id) { // avoid storing empty game id
                          this.cacheService.setLocal('game_id', game.id);
                        }
                      });
                    }

                    if (!this.cacheService.getLocal('game_id') && data.Games) {
                      // For now only have one game per project
                      self.cacheService.setLocal('game_id', data.Games[0].id);
                    }
                  }, err => {
                    console.log("game err: ", err);
                  });

              // get milestone data after login
              this.authService.getUser()
                  .subscribe(
                    data => {
                      self.cacheService.setLocal('name', data.User.name);
                      self.cacheService.setLocal('email', data.User.email);
                      self.cacheService.setLocal('program_id', data.User.program_id);
                      self.cacheService.setLocal('project_id', data.User.project_id);
                      self.cacheService.setLocal('user', data.User);
                    },
                    err => {
                      console.log(err);
                      throw 'Fatal: Unable to retrieve user data.';
                    }
                  );

              // get milestone data after login
              this.milestoneService.getMilestones()
                  .subscribe(
                    data => {
                      loading.dismiss().then(() => {
                        console.log(data[0].id);
                        this.milestone_id = data[0].id;
                        self.cacheService.setLocal('milestone_id', data[0].id);
                        console.log("milestone id: " + data[0].id);
                        this.navCtrl.push(TabsPage).then(() => {
                          this.viewCtrl.dismiss(); // close the login modal and go to dashaboard page
                          window.history.replaceState({}, '', window.location.origin);
                        });
                      });
                    },
                    err => {
                      console.log(err);
                    }
                  )
              this.cacheService.write('isAuthenticated', true);
              this.cacheService.setLocal('isAuthenticated', true);
            }, err => {
              loading.dismiss().then(() => {
                this.logError(err);
                this.cacheService.removeLocal('isAuthenticated');
                this.cacheService.write('isAuthenticated', false);
              });
            });
      });
    });
  }

  /**
   * Insert post_auth() api result into localStorage
   * @param {object} data result from API request
   * @returns Observable/subject
   */
  getLogInData(data){
    let cacheProcesses = [];
    _.forEach(data, (datum, key) => {
      cacheProcesses.push(this.cacheService.write(key, datum));
    });
    cacheProcesses.push(this.cacheService.write('timeline_id', data.Timelines[0].Timeline.id));
    cacheProcesses.push(this.cacheService.write('apikey', data.apikey));
    cacheProcesses.push(this.cacheService.write('timelines', data.Timelines));
    cacheProcesses.push(this.cacheService.write('teams', data.Teams));
    this.cacheService.setLocal('apikey', data.apikey);
    this.cacheService.setLocal('timeline_id', data.Timelines[0].Timeline.id);
    console.log("cache data: " + cacheProcesses);
    return Observable.from(cacheProcesses);
  }

  /**
   * Insert get_user() api result into localStorage
   * @param {object} user result from API request
   */
  getUserKeyData(user){
    let userData = {
      'apikey': user.data.apikey,
      'timelines': user.data.Timelines
    }
    this.cacheService.write('userData', userData);
    this.cacheService.setLocal('userData', userData);
    this.API_KEY = user.data.apikey;
    // console.log("Timeline ID: " + user.data.Timelines[0].Timeline.id);
    // to get API KEY and timeline_id and stored in localStorage
    // then other API calls can directly use (API KEY and timeline_id)
  }

  /**
   * @TODO we'll come back to this logging workflow later in this development
   *
   * This function is used to log unexpected error accountered in the client side
   * @param {object} error result from API request
   */
  logError(error) {
    const alert = this.alertCtrl.create({
      title: 'Login Failed ..',
      message: this.invalidLoginMessage,
      buttons: ['Close']
    });
    alert.present();
    // handle API calling errors display with alert controller
  }

  /**
   * forget password page link function
   */
  linkToForgetPassword() {
    this.navCtrl.push(this.forgetpasswordPage);
    this.viewCtrl.dismiss();
  }
}
