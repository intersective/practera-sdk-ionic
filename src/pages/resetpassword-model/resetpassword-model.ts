import { Component } from '@angular/core';
import { NavController,
         NavParams,
         ViewController,
         LoadingController,
         AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
// services
import { AuthService } from '../../services/auth.service';
import { MilestoneService } from '../../services/milestone.service';
import { CacheService } from '../../shared/cache/cache.service';
// pages
import { TabsPage } from '../tabs/tabs.page';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-resetpassword-model',
  templateUrl: 'resetpassword-model.html'
})
export class ResetpasswordModelPage {
  public password: string;
  public milestone_id: string;
  public verify_password: string;
  private verifySuccess: boolean = null;
  private isLandscaped: boolean = false;
  private resetPwdFormGroup: any;
  private isPwdMatch: boolean = false;
  private verifyPwd: boolean = false;
  private minLengthCheck: boolean = true;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private milestoneService: MilestoneService,
    private cacheService: CacheService
  ) {
    // validation for both password values: required & minlength is 8
    this.resetPwdFormGroup = formBuilder.group({
      password: ['', [Validators.minLength(8),
                      Validators.required]],
      verify_password: ['', [Validators.minLength(8),
                             Validators.required]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordModelPage');
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
      content: 'Password successfully changed. Logging in now.'
    });
    loading.present();
    this.authService.resetUserPassword(key, email, this.password, this.verify_password).subscribe(data => {
        // loading.dismiss();
        // this.navCtrl.push(LoginPage);
        this.authService.loginAuth(email, this.password)
            .subscribe(data => {
              this.cacheService.setLocalObject('apikey', data.apikey);
              this.cacheService.setLocalObject('timelineID', data.Timelines[0].Timeline.id);
              this.cacheService.setLocalObject('teams', data.Teams);
              // get milestone data after login
              this.authService.getUser()
                  .subscribe(
                    data => {
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
              loading.dismiss();
              this.loginError(err);
              this.cacheService.removeLocal('isAuthenticated');
              this.cacheService.write('isAuthenticated', false);
            });
        console.log('Succefully updated');
      },
      err => {
        loading.dismiss();
        console.log('Update failure ..');
      });
  }
  // after password set, auto login error alertbox
  loginError(error) {
    const alertLogin = this.alertCtrl.create({
      title: 'Login Failed ..',
      message: 'Sorry, login failed, please go to login page to sign in',
      buttons: ['Close']
    });
    alertLogin.present();
  }
  // close resetpassword popup modal
  closeModal() {
    this.viewCtrl.dismiss();
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
