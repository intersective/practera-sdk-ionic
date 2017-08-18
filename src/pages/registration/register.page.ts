import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ViewController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { loadingMessages, errMessages, generalVariableMessages } from '../../app/messages';
// services
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
import { MilestoneService } from '../../services/milestone.service';
import { NotificationService } from '../../shared/notification/notification.service';
import { TranslationService } from '../../shared/translation/translation.service';
// directives
import { FormValidator } from '../../validators/formValidator';
// pages
import { RegistrationModalPage } from './modal';
import { TabsPage } from '../tabs/tabs.page';
import { LoginPage } from '../login/login';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';

const supportEmail = generalVariableMessages.helpMail.email;

@Component({
  selector: 'register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {
  @ViewChild('registrationForm') registrationForm: NgForm;
  user: any = {
    password: '',
    verify_password: ''
  };
  submitted: boolean = false;
  private regForm: any;
  private pwdMacthBool: boolean = false;
  private verifyPwd: boolean = false;
  private verifySuccess: boolean = null;
  private isPwdMatch: boolean = false;
  private changeContent: boolean = false;
  private minLengthCheck: boolean = true;
  private clickSuspended: boolean = false;
  private milestone_id: string;
  private password: string;
  private verify_password: string;
  // loading & error messages variables
  private verifyFailedErrMessage = errMessages.Registration.verifyFailed.verifyfailed;
  private successRegistrationLoading: any = loadingMessages.SuccessRegistration.successRegistration;
  private passwordMismatchErrMessage: any = errMessages.Registration.mismatch.mismatch;
  private registrationErrMessage: any = errMessages.Registration.error.error;
  private invalidUserErrMessage: any = errMessages.Registration.invalidUser.account;
  private noPasswordErrMessage: any = errMessages.Registration.noPassword.password;
  private registeredErrMessage: any = errMessages.Registration.alreadyRegistered.registered;
  private passwordMismatchMessage: any = errMessages.PasswordValidation.mismatch.mismatch;
  private passwordMinlengthMessage: any = errMessages.PasswordValidation.minlength.minlength;
  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private viewCtrl: ViewController,
    private notificationService: NotificationService,
    private navParams: NavParams,
    private loading: LoadingController,
    private authService: AuthService,
    private cache: CacheService,
    private gameService: GameService,
    public translationService: TranslationService,
    private milestone: MilestoneService,
  ) {
    // validation for both password values: required & minlength is 8
    this.regForm = fb.group({
      password: ['', [Validators.minLength(8), Validators.required]],
      verify_password: ['', [Validators.minLength(8), Validators.required]],
    });
  }
  ngOnInit() {
  }
  public displayAlert(message) {
    return this.alertCtrl.create({
      title: 'Test',
      message: message,
      buttons: ['OK']
    });
  }
  onSubmit(form: NgForm):void {
    let self = this;
    self.submitted = true;
    function onRegError(err) {
      if (err.frontendErrorCode === 'SERVER_ERROR') {
        throw 'API endpoint error';
      }
      let message = this.registrationErrMessage + `${supportEmail}`;
      if (err && err.data && err.data.msg) {
        switch (err.data.msg) {
          case 'Invalid user':
            message = this.invalidUserErrMessage + `${supportEmail}`;
          break;
          case 'No password':
            message = this.noPasswordErrMessage;
          break;
          case 'User already registered':
            message = this.registeredErrMessage;
          break;
        }
      }
      self.displayAlert(message).present();
      self.submitted = false;
    }
    function onFinally() {
      //@TODO: log something maybe
      // self.navCtrl.push(TabsPage);
      console.log('Final step - log something here');
    }
    if (this.user.password !== this.user.verify_password) {
      this.notificationService.alert({
        title: 'Incorrect Password',
        subTitle: this.passwordMismatchErrMessage,
        buttons: ['Close']
      });
    } else {
      const loading = this.loading.create({
        dismissOnPageChange: true,
        content: this.successRegistrationLoading
      });
      // registration api call: to let user set password and complete registration process
      loading.present().then(() => {
        this.authService.register({
          email: this.cache.getLocal('user.email'),
          key: this.cache.getLocal('user.registration_key'),
          user_id: this.cache.getLocal('user.id'),
          password: this.regForm.get('password').value
        }).subscribe(regRespond => {
          //@TODO: set user data
          regRespond = regRespond.data;
          console.log(regRespond);
          this.cache.setLocalObject('apikey', regRespond.apikey);
          this.cache.setLocalObject('timelineID', regRespond.Timeline.id);
          this.cache.setLocal('gotNewItems', false);
          // after passed registration api call, we come to post_auth api call to let user directly login after registred successfully
          this.authService.loginAuth(this.cache.getLocal('user.email'), this.regForm.get('password').value)
              .subscribe(
                data => {
                  // get game_id data after login
                  this.gameService.getGames()
                      .subscribe(
                        data => {
                          console.log("game data: ", data);
                          _.map(data, (element) => {
                            console.log("game id: ", element[0].id);
                            this.cache.setLocal('game_id', element[0].id);
                          });
                        },
                        err => {
                          console.log("game err: ", err);
                        }
                      );
                  // get user data after registration and login
                  self.authService.getUser()
                      .subscribe(
                        data => {
                          console.log(data);
                        },
                        err => {
                          console.log(err);
                        }
                      );
                  // get milestone data after registration and login
                  self.milestone.getMilestones()
                      .subscribe( data => {
                        loading.dismiss().then(() => {
                          // console.log(data.data[0].id);
                          this.milestone_id = data.data[0].id;
                          self.cache.setLocalObject('milestone_id', data.data[0].id);
                          self.navCtrl.push(TabsPage).then(() => {
                            window.history.replaceState({}, '', window.location.origin);
                          });
                        });
                      },
                      err => {
                        loading.dismiss().then(() => {
                          console.log(err);
                        });
                      });
                },
                err => {
                  loading.dismiss().then(() => {
                    console.log(err);
                  });
                }
              );
        }, onRegError, onFinally);
      });
    }
  }
  setRegistrationData(data) {
    let cacheProcesses = [];
    _.forEach(data, (datum, key) => {
      cacheProcesses.push(this.cache.set(key, datum));
    });
    cacheProcesses.push(this.cache.set('timelineID', data.Timeline.id));
    this.cache.setLocal('timelineID', data.Timeline.id);
    return Observable.from(cacheProcesses);
  }
  goToLogin() {
    this.cache.clear().then(() => {
      this.navCtrl.push(LoginPage);
    });
  }
  // check password minmimum length
  checkMinLength(){
    return (this.password.length < 8 || this.verify_password.length < 8) ? this.minLengthCheck = true : this.minLengthCheck = false;
  }
  // check password mismacth issue
  verifyPwdKeyUp() {
    return this.verifyPwd = true;
  }
  pwdMatchCheck() {
    return this.password != this.verify_password ? this.isPwdMatch = true : this.isPwdMatch = false;
  }
}
