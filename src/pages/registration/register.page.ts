import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ViewController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
import { LoginPage } from '../login/login';
import { RegistrationModalPage } from './modal';
import { TabsPage } from '../tabs/tabs.page';
// Others
import { loadingMessages, errMessages, generalVariableMessages } from '../../app/messages';
import * as _ from 'lodash';

const supportEmail = generalVariableMessages.helpMail.email;

@Component({
  selector: 'register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {
  @ViewChild('registrationForm') registrationForm: NgForm;


  changeContent: boolean = false;
  clickSuspended: boolean = false;
  invalidUserErrMessage: any = errMessages.Registration.invalidUser.account;
  isPwdMatch: boolean = false;
  milestone_id: string;
  minLengthCheck: boolean = true;
  noPasswordErrMessage: any = errMessages.Registration.noPassword.password;
  password: string;
  passwordMismatchErrMessage: any = errMessages.Registration.mismatch.mismatch;
  passwordMismatchMessage: any = errMessages.PasswordValidation.mismatch.mismatch;
  passwordMinlengthMessage: any = errMessages.PasswordValidation.minlength.minlength;
  pwdMacthBool: boolean = false;
  regForm: any;
  registrationErrMessage: any = errMessages.Registration.error.error;
  registeredErrMessage: any = errMessages.Registration.alreadyRegistered.registered;
  submitted: boolean = false;
  successRegistrationLoading: any = loadingMessages.SuccessRegistration.successRegistration;
  user: any = {
    password: '',
    verify_password: ''
  };
  verify_password: string;
  verifyFailedErrMessage = errMessages.Registration.verifyFailed.verifyfailed;
  verifyPwd: boolean = false;
  verifySuccess: boolean = null;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public cache: CacheService,
    public gameService: GameService,
    public loading: LoadingController,
    public milestone: MilestoneService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public notificationService: NotificationService,
    public viewCtrl: ViewController,
    public translationService: TranslationService,
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
