import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { Platform, NavController, AlertController, ToastController, Events } from 'ionic-angular';
// services
import { CacheService } from '../shared/cache/cache.service';
import { AuthService } from '../services/auth.service';
// pages
import { TermConditionPage } from '../pages/term-condition/term-condition.page';
import { SidenavPage } from '../pages/sidenav/sidenav';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { TabsPage } from '../pages/tabs/tabs.page';
import { RegistrationPage } from '../pages/registration/registration.page';
import { TestPage } from '../pages/tabs/test.page';
import { LoginPage } from '../pages/login/login';
import { MagicLinkPage } from '../pages/magic-link/magic-link';

import { WindowRef } from '../shared/window';

@Component({
  templateUrl: 'app.html',
  host: {
    '(window:orientationchange)': 'onScreenResize($event.target)'
  }
})
export class MyApp implements OnInit {
  @ViewChild('appNav') nav: NavController;
  // rootPage: any = RegistrationPage;
  rootPage: any;
  urlParameters: Array<any> = [];
  do = {
    'testing': TestPage,
    'registration': RegistrationPage,
    'register': RegistrationPage,
    'login': LoginPage,
    'resetpassword': ResetPasswordPage,
    'secure': MagicLinkPage
  };

  // trace screen size (we serve only portrait size)
  public isPortrait: boolean = this.initialStatus();
  initialStatus() {
    if (this.platform.isPortrait()) {
      return true;
    } else {
      return false;
    }
  }

  constructor(
    authService: AuthService,
    win: WindowRef,
    zone: NgZone,
    private platform: Platform,
    private cache: CacheService,
    private eventsListener: Events,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    eventsListener.subscribe('toaster', data => {
      let toast = toastCtrl.create({
        message: data.msg,
        duration: 3000
      });
    });
    /*if (!platform.is('ios')) {
      win.nativeWindow.onbeforeunload = (e) => {
        e.preventDefault();
        let alert = alertCtrl.create({
          title: 'Quit App?',
          subTitle: 'Confirm leaving the app.',
          buttons: ['Ok'],
          enableBackdropDismiss: true
        });
        zone.run(() => {
          alert.present().then(() => {
            console.log(e);
          });
        });
      };
    }*/
  }

  /* Customized Flag Start */
  // when screen size changed, disable mobile landscape mode
  // keep desktop (including iPad) devices landscape mode
  test: any;
  onScreenResize(e) {
    let popoverDOM: any = document.querySelector("ion-popover");
    let modelDOM: any = document.querySelector("ion-modal");

    // if () {
        // if () {

    if ((e.screen.orientation && e.screen.orientation.angle < 45) ||
      (this.platform.is('ios') && ((e.innerWidth < 512 && e.innerWidth < e.innerHeight) || e.innerWidth >= 768))) {
      this.isPortrait = true;
      if (popoverDOM){
        popoverDOM.style.opacity = 1;
      }
      if (modelDOM){
        modelDOM.style.opacity = 1;
      }
    } else {
      this.isPortrait = false;
      if (popoverDOM){
        popoverDOM.style.opacity = 0;
      }
      if (modelDOM){
        modelDOM.style.opacity = 0;
      }
    }
    console.log(e.screen.orientation);
  }

  ngOnInit() {
    let category = [];
    let page;
    let navParams = {};

    if (document.URL.indexOf("?") !== -1) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      splitParams.forEach(param => {
        let singleURLParam = param.split('=');
        let urlParameter = {
          'name': singleURLParam[0],
          'value': singleURLParam[1]
        };
        if (singleURLParam[0] === 'do') {
          page = this.do[singleURLParam[1]];
        }
        category.push(urlParameter);
        navParams[singleURLParam[0]] = singleURLParam[1];
      });
    }

    if (page) {
      this.nav.setRoot(page, navParams);
    } else {
      if (this.cache.getLocal('isAuthenticated')) {
        this.nav.setRoot(TabsPage, navParams);
      } else {
        this.nav.setRoot(LoginPage, navParams);
      }
    }
  }
}
