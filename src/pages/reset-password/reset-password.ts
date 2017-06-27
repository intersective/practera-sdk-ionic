import { Component, NgZone, OnInit } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController,
         ModalController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
// services
import { AuthService } from '../../services/auth.service';
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
export class ResetPasswordPage {
  public keyVal: string;
  public emailVal: string;
  private windowHeight: number = window.innerHeight / 3;
  private isLandscaped: boolean = false;
  public password: string;
  public verify_password: string;
  private verifySuccess: boolean = null;
  private resetPwdFormGroup: any;
  private verifyPwd: boolean = false;
  private minLengthCheck: boolean = true;
  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private ngZone: NgZone,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private authService: AuthService,
              private loadingCtrl: LoadingController,
              private responsiveService: ResponsiveService) {
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
      content: 'Verifying user identity ..'
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
  popResetpasswordModel(){
    let resetpasswordModal = this.modalCtrl.create(ResetpasswordModelPage, {"key": this.keyVal, "email": this.emailVal});
    resetpasswordModal.present();
  }
}
