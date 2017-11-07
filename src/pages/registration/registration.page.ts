import { Component, OnInit } from '@angular/core';

import { CacheService } from '../../shared/cache/cache.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages';
// services
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../shared/request/request.service';
import { NotificationService } from '../../shared/notification/notification.service';
// pages
import { LoginPage } from '../../pages/login/login';
@Component({
  template: `<term-condition [user]='user'></term-condition>`,
})
export class RegistrationPage implements OnInit {
  user: Object = {
    email: null,
    key: null
  };
  term: String;
  content: SafeResourceUrl;
  prefixUrl: any = this.request.getPrefixUrl();
  // loadinbg & error message variables
  verifyFailedErrMessage = errMessages.Registration.verifyFailed.verifyfailed;

  constructor(
    public nav: NavController,
    public params: NavParams,
    public authService: AuthService,
    public sanitizer: DomSanitizer,
    public notification: NotificationService,
    public translationService: TranslationService,
    public alertCtrl: AlertController,
    public cache: CacheService,
    public request: RequestService) {}

  displayError(errorMessage?: any): void {
    let alert = this.alertCtrl.create({
      title: 'Invalid registration code',
      subTitle: errorMessage || 'Registration Code is invalid, please contact our tech support for assistance.',
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss().then(() => {
            this.nav.setRoot(LoginPage).then(() => {
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
    // check if email and activation_code are provided in the url/params
    if (!decodeURIComponent(this.params.get('email')) || !this.params.get('key')) {
      this.displayError();
    } else {
      let email = decodeURIComponent(this.params.get('email')),
        key = this.params.get('key');
      this.authService.verifyRegistration({
        email: email,
        key: key
      }).subscribe(res => {
        this.cache.setLocal('user.email', email);
        this.cache.setLocal('user.registration_key', key);
        this.cache.setLocal('user.id', res.data.User.id);
        this.user = {
          email: email,
          key: key
        };
        Observable.forkJoin([
          this.cache.write('user.email', email),
          this.cache.write('user.registration_key', key),
          this.cache.write('user.id', res.data.User.id)
        ]).subscribe(responds => {
          console.log('RespondsVerify::', responds);
        });
      }, err => {
        console.log(err);
        this.displayError(err.msg);
      });
    }
  }

  ionViewDidEnter(): void {
    // this.authService.getTerms().subscribe(res => {
    //   console.log("terms data: ", res);
    //   this.term = res.terms_description;
    //   this.content = this.sanitizer.bypassSecurityTrustResourceUrl(this.prefixUrl + res.terms_url);
    // });
    // this.params.get('test');
  }

  ionViewDidLoad(): void {
    let category = [];
    /*if (document.URL.indexOf("?") !== -1) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      console.log(splitURL, splitParams);
      splitParams.forEach(param => {
        let singleURLParam = param.split('=');
        let urlParameter = {
          'name': singleURLParam[0],
          'value': singleURLParam[1]
        };
        category.push(urlParameter);
      });
    }*/
  }
}
