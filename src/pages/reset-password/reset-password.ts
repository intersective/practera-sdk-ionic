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
import { AuthService } from '../../services/auth.service';
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
import { MilestoneService } from '../../services/milestone.service';
import { ResponsiveService } from '../../services/responsive.service';
import { TranslationService } from '../../shared/translation/translation.service';
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage implements OnInit {
  public emailVal: string;
  public gameID: string = null;
  public isLandscaped: boolean = false;
  public isPwdMatch: boolean = false;
  public keyVal: string;
  public minLengthCheck: boolean = true;
  public milestone_id: string;
  public password: string;
  public resetPwdFormGroup: any;
  public userData: any = [];
  public verify_password: string;
  public verifyPwd: boolean = false;
  public verifySuccess: boolean = null;
  // loading & error message variables
  public invalidLinkErrMessage = errMessages.ResetPassword.invalidLink.invalid;
  public passwordMismatchMessage: any = errMessages.PasswordValidation.mismatch.mismatch;
  public passwordMinlengthMessage: any = errMessages.PasswordValidation.minlength.minlength;
  public resetPasswordLoginFailedMessage: any = errMessages.ResetPassword.resetLoginFailed.failed;
  public successResetPasswordMessage: any = loadingMessages.SuccessResetPassword.successResetPassword;
  public verifyUserMessage = loadingMessages.VerifyUser.verify;
  constructor(public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public milestoneService: MilestoneService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public authService: AuthService,
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
    loading.present();
    this.authService.verifyUserKeyEmail(key, email)
      .subscribe(data => {
        loading.dismiss();
        this.verifySuccess = true;
      },
      err => {
        loading.dismiss();
        this.verifySuccess = false;
        setTimeout(() => {
          this.navCtrl.setRoot(LoginPage).then(() => {
              window.history.replaceState({}, '', window.location.origin);
            });
        }, 30000);
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
