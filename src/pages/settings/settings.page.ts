import { Component } from '@angular/core';
import { App, NavController, MenuController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { i18nData } from './assets/i18n-en'; 
import { loadingMessages, errMessages } from '../../app/messages'; 
// services
import { CacheService } from '../../shared/cache/cache.service';
// pages
import { LoginPage } from '../../pages/login/login';
@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public logoutMessage: any = loadingMessages.Logout.logout;
  constructor(
    private cache: CacheService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    public translate: TranslateService,
    private appCtrl: App
  ) {
    translate.addLangs(["en"]);
    translate.setDefaultLang('en');
    translate.use('en');
  }
  public settings = [];
  public getUserEmail() {
    return 'abcd.example.cc';
  }
  public logout() {
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: this.logoutMessage
    });
    loader.present().then(() => {
      this.cache.clear().then(() => {
        localStorage.clear();
        window.location.reload(); // the reason of doing this is because of we need to refresh page content instead of API data cache issue occurs
        loader.dismiss();
        this.navCtrl.push(LoginPage);
      });
    });
  }
}
