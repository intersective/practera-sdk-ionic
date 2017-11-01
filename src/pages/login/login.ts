import { Component, ViewChild } from '@angular/core';
import { AlertController,
         LoadingController,
         ModalController,
         NavController,
         NavParams,
         ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { loadingMessages, errMessages } from '../../app/messages';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '../../shared/translation/translation.service';
import * as _ from 'lodash';
// directives
import { FormValidator } from '../../shared/validators/formValidator';
// pages
import { TabsPage } from '../../pages/tabs/tabs.page';
import { ForgetPasswordPage } from '../../pages/forget-password/forget-password';
// services
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
import { MilestoneService } from '../../services/milestone.service';
import { RequestServiceConfig } from '../../shared/request/request.service';
/* This page is for handling user login process */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public API_KEY: string = null;
  public email: string = null;
  public gameID: string = null;
  public forgetpasswordPage = ForgetPasswordPage;
  public invalidLoginMessage: any = errMessages.Login.login;
  public loginFormGroup: any;
  public loginLoadingMessages: any = loadingMessages.Login.login;
  public milestone_id: string = null;
  public password: any = null;
  public userData: any = [];
  public userName: string = null;
  public userImage: string = null;
  constructor(
    public config: RequestServiceConfig,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthService,
    public cacheService: CacheService,
    public gameService: GameService,
    public milestoneService: MilestoneService,
    public translationService: TranslationService) {
    this.navCtrl = navCtrl;
    this.loginFormGroup = formBuilder.group({
      email: ['', [FormValidator.isValidEmail,
                   Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ionViewCanLeave(): boolean {
    // to check whether user is authorized
    let authorized = true;
    return authorized ? true : false;
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
              self.cacheService.setLocalObject('apikey', data.apikey);
              // saved for 3 types of timeline id in order for later use
              self.cacheService.setLocalObject('timelineId', data.Timelines[0].Timeline.id);
              self.cacheService.setLocalObject('timelineID', data.Timelines[0].Timeline.id);
              self.cacheService.setLocalObject('teams', data.Teams);
              self.cacheService.setLocal('gotNewItems', false);
              let getGame = this.gameService.getGames();
              let getUser = this.authService.getUser();
              let getMilestone = this.milestoneService.getMilestones();
              Observable.forkJoin([getGame, getUser, getMilestone])
                .subscribe(
                  results => {
                    loading.dismiss().then(() => {
                      // results[0] game API data
                      this.gameID = results[0].Games[0].id;
                      if(this.gameID){
                        this.cacheService.setLocalObject('game_id', this.gameID);
                      }
                      // results[1] user API data
                      this.userData = results[1];
                      if(this.userData){
                        this.cacheService.setLocalObject('name', results[1].User.name);
                        this.cacheService.setLocalObject('email', results[1].User.email);
                        this.cacheService.setLocalObject('program_id', results[1].User.program_id);
                        this.cacheService.setLocalObject('project_id', results[1].User.project_id);
                        this.cacheService.setLocalObject('user', results[1].User);
                      }
                      // results[2] milestone API data
                      this.milestone_id = results[2][0].id;
                      if(this.milestone_id){
                        this.cacheService.setLocalObject('milestone_id', this.milestone_id);
                      }
                      this.navCtrl.setRoot(TabsPage).then(() => {
                        this.viewCtrl.dismiss(); // close the login modal and go to dashaboard page
                        window.history.replaceState({}, '', window.location.origin); // reformat current url 
                      });
                    });
                  },
                  err => {
                    this.logError(err);
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
    this.cacheService.setLocalObject('userData', userData);
    this.API_KEY = user.data.apikey;
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
      title: 'Error Message',
      message: 'Oops, loading failed, please try it again later.',
      buttons: ['Close']
    });
    alert.present();
    // handle API calling errors display with alert controller
  }
  /**
   * forget password page link function
   */
  linkToForgetPassword() { 
    this.modalCtrl.create(this.forgetpasswordPage).present(); // go to forgot password modal window 
  }
}
