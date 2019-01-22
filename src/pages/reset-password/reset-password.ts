import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController,
         LoadingController,
         ModalController,
         NavController,
         NavParams,
         ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { loadingMessages, errMessages } from '../../app/messages';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

// directives
import { FormValidator } from '../../shared/validators/formValidator';

// pages
import { TabsPage } from '../tabs/tabs.page';
import { LoginPage } from '../login/login';
import { ResetpasswordModelPage } from '../../pages/resetpassword-model/resetpassword-model';

// services
import { AppService } from '../../services/app.service';
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../shared/cache/cache.service';
import { ResponsiveService } from '../../services/responsive.service';
import { TranslationService } from '../../shared/translation/translation.service';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})

export class ResetPasswordPage implements OnInit {
  emailVal: string;
  gameID: string = null;
  isLandscaped: boolean = false;
  isPwdMatch: boolean = false;
  keyVal: string;
  minLengthCheck: boolean = true;
  milestone_id: string;
  password: string;
  resetPwdFormGroup: any;
  userData: any = [];
  verify_password: string;
  verifyPwd: boolean = false;
  verifySuccess: boolean = null;
  // loading & error message variables
  invalidLinkErrMessage: any = null;
  passwordMismatchMessage: any = null;
  passwordMinlengthMessage: any = null;
  resetPasswordLoginFailedMessage: any = null;
  successResetPasswordMessage: any = null;
  verifyUserMessage: any = null;

  constructor(public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appService: AppService,
    public authService: AuthService,
    public cacheService: CacheService,
    public translationService: TranslationService) {
      // validation for both password values: required & minlength is 8
      this.resetPwdFormGroup = formBuilder.group({
          password: ['', [Validators.minLength(8), Validators.required]],
          verify_password: ['', [Validators.minLength(8), Validators.required]],
      });
      this.invalidLinkErrMessage = errMessages.ResetPassword.invalidLink.invalid;
      this.passwordMismatchMessage = errMessages.PasswordValidation.mismatch.mismatch;
      this.passwordMinlengthMessage = errMessages.PasswordValidation.minlength.minlength;
      this.resetPasswordLoginFailedMessage = errMessages.ResetPassword.resetLoginFailed.failed;
      this.successResetPasswordMessage = loadingMessages.SuccessResetPassword.successResetPassword;
      this.verifyUserMessage = loadingMessages.VerifyUser.verify;
    }

  ngOnInit() {}

  ionViewWillEnter() {
    this.verifyKeyEmail();
  }

  /**
   * to verify user is whether typed or clicked the email link
   * Purpose: if user is typed the email link key and email, user is not allowed
              to veiw the reset password page and display one error hint screen
              for user. As long as user clicked email link from mailbox, user is
              enabled to view the reset password page
   * @param { key, email }
   * @return if user clicked email link, return reset password page, otherwise,
             return error hint screen
  */
  verifyKeyEmail(){
    let key = this.navParams.get('key'),
        email = decodeURIComponent(this.navParams.get('email'));
        this.keyVal = key;
        this.emailVal = email;
    const loading = this.loadingCtrl.create({
      content: this.verifyUserMessage
    });
    loading.present().then(() => {
      this.authService.verifyUserKeyEmail(key, email)
      .subscribe(data => {
        loading.dismiss();
        this.verifySuccess = true;
      },
      err => {
        loading.dismiss().then(() => {
          this.verifySuccess = false;
          setTimeout(() => {
            this.navCtrl.setRoot(LoginPage).then(() => {
                window.history.replaceState({}, '', window.location.origin);
              });
          }, 30000);
        });
      });
    });
  }

  /**
   * to update password in db
   * Purpose: store new password for user
   * @param { key, email, password, verify_password }
   * @return if API request is passed (status code: 200), user password updated
             successfully, otherwise, error hint popup to indicate user password
             update failed
  */
  updatePassword(){
    let key = this.navParams.get('key'),
        email = decodeURIComponent(this.navParams.get('email'));
    const loading = this.loadingCtrl.create({
      content: this.successResetPasswordMessage
    });
    loading.present().then(() => {
      this.authService.resetUserPassword(key, email, this.password, this.verify_password).subscribe(data => {
        this.authService.loginAuth(email, this.password)
            .subscribe(data => {
              this.cacheService.setLocal('apikey', data.apikey);
              this.cacheService.setLocal('timelineID', data.Timelines[0].Timeline.id);
              this.cacheService.setLocal('teams', data.Teams);
              this.cacheService.setLocal('gotNewItems', false);
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
              this.cacheService.write('isAuthenticated', true);
              this.cacheService.setLocal('isAuthenticated', true);
            },
            err => {
              loading.dismiss().then(() => {
                this.logError(err);
                this.cacheService.removeLocal('isAuthenticated');
                this.cacheService.write('isAuthenticated', false);
              });
            });
      },
      err => {
        loading.dismiss().then(() => {
          this.logError(err);
        });
      });
    });
  }

  // after password set, auto login error alertbox
  logError(error) {
    const alertLogin = this.alertCtrl.create({
      title: 'Error Message',
      message: 'Oops, loading failed, please try it again later.',
      buttons: ['Close']
    });
    alertLogin.present();
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

  // go to login page when verification is failed
  goToLogin() {
    this.navCtrl.setRoot(LoginPage).then(() => {
      window.history.replaceState({}, '', window.location.origin);
    });
  }
}
