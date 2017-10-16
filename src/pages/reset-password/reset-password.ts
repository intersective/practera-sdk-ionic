import { Component, NgZone, OnInit } from '@angular/core';
import { NavController,
         ViewController,
         NavParams,
         LoadingController,
         AlertController,
         ModalController } from 'ionic-angular';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages'; 
import { FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';
// services
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
import { MilestoneService } from '../../services/milestone.service';
import { ResponsiveService } from '../../services/responsive.service';
// directives
import {FormValidator} from '../../validators/formValidator';
// pages
import { TabsPage } from '../tabs/tabs.page';
import { LoginPage } from '../login/login';
import { ResetpasswordModelPage } from '../../pages/resetpassword-model/resetpassword-model';
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage implements OnInit {
  public keyVal: string;
  public emailVal: string;
  public windowHeight: number = window.innerHeight / 3;
  public isLandscaped: boolean = false;
  public password: string;
  public verify_password: string;
  public verifySuccess: boolean = null;
  public resetPwdFormGroup: any;
  public verifyPwd: boolean = false;
  public minLengthCheck: boolean = true;
  public milestone_id: string;
  public isPwdMatch: boolean = false;
  // loading & error message variables
  public invalidLinkErrMessage = errMessages.ResetPassword.invalidLink.invalid;
  public verifyUserMessage = loadingMessages.VerifyUser.verify;
  public successResetPasswordMessage: any = loadingMessages.SuccessResetPassword.successResetPassword;
  public resetPasswordLoginFailedMessage: any = errMessages.ResetPassword.resetLoginFailed.failed;
  public passwordMismatchMessage: any = errMessages.PasswordValidation.mismatch.mismatch;
  public passwordMinlengthMessage: any = errMessages.PasswordValidation.minlength.minlength;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public milestoneService: MilestoneService,
    public cacheService: CacheService,
    public gameService: GameService,
    public translationService: TranslationService) {
      // validation for both password values: required & minlength is 8
      this.resetPwdFormGroup = formBuilder.group({
          password: ['', [Validators.minLength(8), Validators.required]],
          verify_password: ['', [Validators.minLength(8), Validators.required]],
      })
    }
  /**
   * Detect user device type (mobile or desktop) on initial page load
   * Purpose: Initially page loaded, this peice code will detect user screen
              whether is mobile or desktop device (including iPad).
   * @param {}
   * @return A calculated ratio value plus screen innerWidth value to determine
             user screen is mobile device or desktop device. If device is mobile
             device, ngOnInit() will disable landscape mode for mobile device
  */
  ngOnInit() {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }
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
    loading.present();
    this.authService.verifyUserKeyEmail(key, email)
      .subscribe(data => {
        loading.dismiss();
        this.verifySuccess = true;
        console.log("valueTrue: " + this.verifySuccess);
      },
      err => {
        loading.dismiss();
        this.verifySuccess = false;
        console.log("valueFalse: " + this.verifySuccess);
        setTimeout(() => {
          this.navCtrl.push(LoginPage).then(() => {
              window.history.replaceState({}, '', window.location.origin);
            });
        }, 5000);
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
        // loading.dismiss();
        // this.navCtrl.push(LoginPage);
        this.authService.loginAuth(email, this.password)
            .subscribe(data => {
              data = data.data;
              this.cacheService.setLocalObject('apikey', data.apikey);
              this.cacheService.setLocalObject('timelineID', data.Timelines[0].Timeline.id);
              this.cacheService.setLocalObject('teams', data.Teams);
              this.cacheService.setLocal('gotNewItems', false);
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
                      loading.dismiss().then(() => {
                        console.log(data.data[0].id);
                        this.milestone_id = data.data[0].id;
                        this.cacheService.setLocalObject('milestone_id', data.data[0].id);
                        console.log("milestone id: " + data.data[0].id);
                        loading.dismiss();
                        this.navCtrl.push(TabsPage).then(() => {
                          this.viewCtrl.dismiss(); // close the login modal and go to dashaboard page
                          window.history.replaceState({}, '', window.location.origin);
                        });
                      });
                    },
                    err => {
                      loading.dismiss().then(() => {
                        console.log(err);
                      });
                    }
                  )
              this.cacheService.write('isAuthenticated', true);
              this.cacheService.setLocal('isAuthenticated', true);
            },
            err => {
              loading.dismiss().then(() => {
                this.loginError(err);
                this.cacheService.removeLocal('isAuthenticated');
                this.cacheService.write('isAuthenticated', false);
              });
            });
      },
      err => {
        loading.dismiss().then(() => {
          console.log(err);
        });
      });
    });
  }
  // after password set, auto login error alertbox
  loginError(error) {
    const alertLogin = this.alertCtrl.create({
      title: 'Login Failed ..',
      message: this.resetPasswordLoginFailedMessage,
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
}
