import { Component, NgZone, OnInit } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController,
         ModalController  } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
// services
import { AuthService } from '../../services/auth.service';
import { MilestoneService } from '../../services/milestone.service';

import { CacheService } from '../../shared/cache/cache.service';
// directives
import { FormValidator } from '../../validators/formValidator';
// pages
import { LoginModalPage } from '../../pages/login-modal/login-modal';
import { TabsPage } from '../../pages/tabs/tabs.page';
import { ForgetPasswordPage } from '../../pages/forget-password/forget-password';
import * as _ from 'lodash';


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
  loginFormGroup: any;

  private windowHeight: number = window.innerHeight / 3;
  private isLandscaped: boolean = false;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private milestoneService: MilestoneService,
    private cacheService: CacheService,
    private ngZone:NgZone,
    private modalCtrl: ModalController
  ) {
    this.loginFormGroup = formBuilder.group({
      email: ['', [FormValidator.isValidEmail,
                   Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    window.onresize = (e) => {
        this.ngZone.run(() => {
            function gcd (v1, v2) {
              return (v2 == 0) ? v1 : gcd(v2, v1%v2);
            }
            let screnWidth = window.innerWidth;
            let screenHeight = window.innerHeight;
            let ratio = gcd(screnWidth, screenHeight);
            let ratioRate = (screnWidth/ratio)/(screenHeight/ratio);
            if(ratioRate > 1.2 && window.innerWidth < 1024){
              this.windowHeight = window.innerHeight / 6;
              return this.isLandscaped = true;
            } else {
              this.windowHeight = window.innerHeight / 3;
              return this.isLandscaped = false;
            }
        });
    };
  }

  ngOnInit() {
    function gcd (v1, v2) {
      return (v2 == 0) ? v1 : gcd(v2, v1%v2);
    }
    let screnWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let ratio = gcd(screnWidth, screenHeight);
    let ratioRate = (screnWidth/ratio)/(screenHeight/ratio);
    return (ratioRate > 1.2 && window.innerWidth < 1024) ? this.isLandscaped = true : this.isLandscaped = false;
  }

  popLoginModal() {
    let loginModal = this.modalCtrl.create(LoginModalPage);
    loginModal.present();
  }

  ionViewDidEnter() {
    console.log(this.navParams);
    console.log(this.navParams.get('test'));
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

  // user login function to authenticate user with email and password
  userLogin() {
    let self = this;

    // add loading effect during login process
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Signing in ..'
    });
    loading.present();

    function rxjsErr(err) {
      console.log('Rxjs Error::', err)
    }

    function rxjsFinally() {
      console.log('finally!');
      loading.dismiss();
    }

    // This part is calling post_auth() API from backend
    this.authService.loginAuth(this.email, this.password)
        .subscribe(data => {

          self.cacheService.setLocalObject('apikey', data.apikey);
          self.cacheService.setLocalObject('timelines', data.Timelines);
          self.cacheService.setLocalObject('teams', data.Teams);

          this.setLoginData(data).subscribe(function(res) {
            Observable.forkJoin([
              self.authService.getUser(),
              self.milestoneService.getList()
            ]).subscribe(res => {
              let user = res[0],
                  milestone = res[1];
              Observable.from([
                self.cacheService.write('user', user),
                self.cacheService.write('milestone', milestone),
                self.cacheService.setLocalObject('user', user),
                self.cacheService.setLocalObject('milestone', milestone),
              ]).subscribe(
                res => {console.log(res)},
                err => console.log(err),
                () => {
                  loading.dismiss();
                  console.log("here?");
                  self.navCtrl.push(TabsPage);
                }
              );
            }, rxjsErr, rxjsFinally);
          }, rxjsErr, rxjsFinally);

          self.cacheService.setLocal('isAuthenticated', true);
          self.cacheService.write('isAuthenticated', true);
        }, err => {
          loading.dismiss();
          self.logError(err);
          self.cacheService.removeLocal('isAuthenticated');
          self.cacheService.write('isAuthenticated', false);
        });
  }

  setLoginData(data) {
    let cacheProcesses = [];
    _.forEach(data, (datum, key) => {
      cacheProcesses.push(this.cacheService.write(key, datum));
    });

    cacheProcesses.push(this.cacheService.write('timeline_id', data.Timelines[0].Timeline.id));
    cacheProcesses.push(this.cacheService.write('apikey', data.apikey));
    cacheProcesses.push(this.cacheService.write('timelines', data.Timelines));
    cacheProcesses.push(this.cacheService.write('teams', data.Teams));

    this.cacheService.setLocalObject('timelines', data.Timelines);
    this.cacheService.setLocalObject('teams', data.Teams);
    this.cacheService.setLocal('apikey', data.apikey);
    this.cacheService.setLocal('timeline_id', data.Timelines[0].Timeline.id);

    return Observable.from(cacheProcesses);
  }

  getUserKeyData(user) {
    let userData = {
      'apikey': user.data.apikey,
      'timelines': user.data.Timelines
    }
    this.cacheService.write('userData', userData);
    this.cacheService.setLocalObject('userData', userData);
    // to get API KEY and timeline_id and stored in localStorage
    // then other API calls can directly use (API KEY and timeline_id)
  }

  logError(error) {
    const alert = this.alertCtrl.create({
      title: 'Login Failed ..',
      message: 'Invalid email or password, please type it again',
      buttons: ['OK']
    });
    alert.present();
    // handle API calling errors display with alert controller
  }

  // forget password page link function
  linkToForgetPassword() {
    this.navCtrl.push(ForgetPasswordPage);
  }
}
