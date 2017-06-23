import { Component } from '@angular/core';
import { App, NavController, MenuController } from 'ionic-angular';
import { CacheService } from '../../shared/cache/cache.service';
// import { ActivityService } from '../../../services/activity.service';
// import { MilestoneService } from '../../../services/milestone.service';
// pages
import { LoginPage } from '../../pages/login/login';
@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  constructor(
    private cache: CacheService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private appCtrl: App
  ) {}
  public settings = [];
  public getUserEmail() {
    return 'abcd.example.cc';
  }
  public logout() {
    this.cache.clear().then(() => {
      let root = this.appCtrl.getRootNav();
      // root.setRoot(LoginPage);
      localStorage.clear();
      this.navCtrl.push(LoginPage).then(() => {
        window.history.replaceState({}, '', window.location.origin);
      });
      // this.navCtrl.rootNav.setRoot(LoginPage);
    });
  }
}
