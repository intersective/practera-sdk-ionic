import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
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
@Component({
  templateUrl: 'app.html',
})
export class MyApp implements OnInit {
  initialStatus(){
    if(navigator.userAgent.includes("iPhone")){
      if(((window.innerWidth < 512 && window.innerWidth < window.innerHeight) || window.innerWidth >= 768)) {
        return true;
      }else {
        return false;
      }
    }else {
      if(((screen.width < 512 && screen.width < screen.height) || screen.width >= 768)) {
        return true;
      }else {
        return false;
      }
    }
  }
  public isMobile: boolean = this.initialStatus();
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
  @ViewChild('appNav') nav: NavController;
  constructor(
    platform: Platform,
    authService: AuthService,
    private cache: CacheService
  ) {
    /* Customized Flag Start */
    // when screen size changed, disable mobile landscape mode
    // keep desktop (including iPad) devices landscape mode
    window.onresize = (e) => {
      let popoverDOM: any = document.querySelector("ion-popover");
      let modelDOM: any = document.querySelector("ion-modal");
      if(navigator.userAgent.includes("iPhone")){
        if(((window.innerWidth < 512 && window.innerWidth < window.innerHeight) || window.innerWidth >= 768)) {
          this.isMobile = true;
          if(popoverDOM){
            popoverDOM.style.opacity = 1;
          }
          if(modelDOM){
            modelDOM.style.opacity = 1;
          }
        }else {
          this.isMobile = false;
          if(popoverDOM){
            popoverDOM.style.opacity = 0;
          }
          if(modelDOM){
            modelDOM.style.opacity = 0;
          }
        }
      }else {
        if(((screen.width < 512 && screen.width < screen.height) || screen.width >= 768)) {
          this.isMobile = true;
          if(popoverDOM){
            popoverDOM.style.opacity = 1;
          }
          if(modelDOM){
            modelDOM.style.opacity = 1;
          } 
        }else {
          this.isMobile = false;
          if(popoverDOM){
            popoverDOM.style.opacity = 0;
          }
          if(modelDOM){
            modelDOM.style.opacity = 0;
          }
        }
      }
    };
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
  ionViewDidLoad(){

  }
}
