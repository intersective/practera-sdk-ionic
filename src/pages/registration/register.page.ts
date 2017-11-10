import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { loadingMessages, errMessages, generalVariableMessages } from '../../app/messages'; 
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';

// directives
import { FormValidator } from '../../shared/validators/formValidator';

// pages
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs.page';
import { TermsConditionsPage } from './terms-conditions/terms-conditions.page';

// services
import { AppService } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../shared/cache/cache.service';
import { NotificationService } from '../../shared/notification/notification.service';
import { TranslationService } from '../../shared/translation/translation.service';
const supportEmail = generalVariableMessages.helpMail.email;

@Component({
  selector: 'register',
  templateUrl: 'register.html'
})

export class RegisterPage implements OnInit { // this part of registration is for setting password before login
  @ViewChild('registrationForm') registrationForm: NgForm;
  agreed: boolean = false;
  changeContent: boolean = false;
  clickSuspended: boolean = false;
  gameID: string = null;
  isPwdMatch: boolean = false;
  milestone_id: string = null;
  minLengthCheck: boolean = true;
  password: string = null;
  regForm: any;
  submitted: boolean = false;
  userInput: any = {
    password: '',
    verify_password: ''
  };
  user: any = {
    email: null,
    key: null
  };
  pwdMacthBool: boolean = false;
  userData: any = [];
  verify_password: string;
  verifyPwd: boolean = false;
  verifySuccess: boolean = null;
  // loading & error messages variables
  invalidUserErrMessage: any = null;
  noPasswordErrMessage: any = null;
  termConditionsErrMessage: any = null;
  passwordMinlengthMessage: any = null;
  passwordMismatchErrMessage: any = null;
  passwordMismatchMessage: any = null;
  registeredErrMessage: any = null;
  registrationErrMessage: any = null;
  successRegistrationLoading: any = null;
  termConditionsVerifyFailedErr: any = null;
  verifyFailedErrMessage: any = null;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appService: AppService,
    public authService: AuthService,
    public cacheService: CacheService,
    public loading: LoadingController,
    public notificationService: NotificationService,
    public translationService: TranslationService) {
    // validation for both password values: required & minlength is 8 and accept for terms and conditions
    this.regForm = fb.group({
      password: ['', [Validators.minLength(8), Validators.required]],
      verify_password: ['', [Validators.minLength(8), Validators.required]],
      agreed: [this.agreed, Validators.required]
    });
    this.invalidUserErrMessage = errMessages.Registration.invalidUser.account;
    this.noPasswordErrMessage = errMessages.Registration.noPassword.password;
    this.termConditionsErrMessage = errMessages.Registration.acceptTermsConditions.accepted;
    this.passwordMinlengthMessage = errMessages.PasswordValidation.minlength.minlength;
    this.passwordMismatchErrMessage = errMessages.Registration.mismatch.mismatch;
    this.passwordMismatchMessage = errMessages.PasswordValidation.mismatch.mismatch;
    this.registeredErrMessage = errMessages.Registration.alreadyRegistered.registered;
    this.registrationErrMessage = errMessages.Registration.error.error;
    this.successRegistrationLoading = loadingMessages.SuccessRegistration.successRegistration;
    this.termConditionsVerifyFailedErr = errMessages.TermConditions.verifyFailed.verifyfailed;
    this.verifyFailedErrMessage = errMessages.Registration.verifyFailed.verifyfailed;
  }

  displayError(errorMessage?: any): void {
    let alert = this.alertCtrl.create({
      title: 'Invalid registration code',
      subTitle: errorMessage || 'Registration Code is invalid, please contact our tech support for assistance.',
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss().then(() => {
            this.navCtrl.setRoot(LoginPage).then(() => {
              window.history.replaceState({}, '', window.location.origin);
            });
          })
          return false;
        }
      }]
    });
    alert.present();
  }

  ngOnInit() {
    const loading = this.loading.create({
      content: 'Verifying user identity..'
    });
    if (!decodeURIComponent(this.navParams.get('email')) || !this.navParams.get('key')) {
      this.displayError();
    } 
    else {
      loading.present().then(() => {
        let email = decodeURIComponent(this.navParams.get('email')),
            key = this.navParams.get('key');
        this.user = {
          email: email,
          key: key
        }
        this.authService.verifyRegistration(this.user)
          .subscribe(
            res => {
              loading.dismiss().then(() => {
                this.cacheService.setLocal('user.email', email);
                this.cacheService.setLocal('user.registration_key', key);
                this.cacheService.setLocal('user.id', res.User.id);
              });
            }, 
            err => {
              loading.dismiss().then(() => {
                this.displayError(err.msg);
              });
            }
          );
      });
    }
  }

  public displayAlert(message) {
    return this.alertCtrl.create({
      title: 'Error',
      message: message,
      buttons: ['Close']
    });
  }

  // submit registration form and display error message when error occurs
  onSubmit(form: NgForm):void {
    let self = this;
    self.submitted = true;
    function onRegError(err) {
      if (err.frontendErrorCode === 'SERVER_ERROR') {
        throw 'API endpoint error';
      }
      let message = this.registrationErrMessage + supportEmail;
      if (err && err.data && err.data.msg) {
        switch (err.data.msg) {
          case 'Invalid user':
            message = this.invalidUserErrMessage + supportEmail;
          break;
          case 'No password':
            message = this.noPasswordErrMessage;
          break;
          case 'User already registered':
            message = this.registeredErrMessage;
          break;
          default: 
            message = this.registrationErrMessage + supportEmail;
          break;
        }
      }
      self.displayAlert(message).present();
      self.submitted = false;
    }
    if (this.userInput.password !== this.userInput.verify_password) {
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
          email: this.cacheService.getLocal('user.email'),
          key: this.cacheService.getLocal('user.registration_key'),
          user_id: this.cacheService.getLocal('user.id'),
          password: this.regForm.get('password').value
        }).subscribe(regRespond => {
          //@TODO: set user data
          this.cacheService.setLocal('apikey', regRespond.apikey);
          this.cacheService.setLocal('timelineID', regRespond.Timeline.id);
          this.cacheService.setLocal('gotNewItems', false);
          // after passed registration api call, we come to post_auth api call to let user directly login after registred successfully
          this.authService.loginAuth(this.cacheService.getLocal('user.email'), this.regForm.get('password').value)
              .subscribe(
                data => {
                  this.appService.getCharacter()
                    .subscribe(
                      results => {
                        loading.dismiss().then(() => {
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
                },
                err => {
                  loading.dismiss().then(() => {
                    this.logError(err);
                  });
                }
              );
        }, onRegError);
      });
    }
  }

  logError(error){
    const alert = this.alertCtrl.create({
      title: 'Error Message',
      message: 'Oops, loading failed, please try it again later.', 
      buttons: ['Close']
    });
    alert.present();
  }

  setRegistrationData(data) {
    let cacheProcesses = [];
    _.forEach(data, (datum, key) => {
      cacheProcesses.push(this.cacheService.set(key, datum));
    });
    cacheProcesses.push(this.cacheService.set('timelineID', data.Timeline.id));
    this.cacheService.setLocal('timelineID', data.Timeline.id);
    return Observable.from(cacheProcesses);
  }

  goToLogin() {
    this.cacheService.clear().then(() => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

  // check password minmimum length
  checkMinLength(){
    return (this.password.length < 8 || this.verify_password.length < 8) ? this.minLengthCheck = true : this.minLengthCheck = false;
  }

  // set verify password value to true
  verifyPwdKeyUp() {
    return this.verifyPwd = true;
  }

  // check password mismacth
  pwdMatchCheck() {
    return this.password != this.verify_password ? this.isPwdMatch = true : this.isPwdMatch = false;
  }

  // toggleAgree()
  toggleAgree(): void {
    this.agreed = !this.agreed;
  }

  // openTermsCondition()
  openTermsCondition() {
    this.modalCtrl.create(TermsConditionsPage).present();
  }
}
