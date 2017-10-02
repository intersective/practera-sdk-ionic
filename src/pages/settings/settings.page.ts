import { Component } from '@angular/core';
import { App, NavController, MenuController, LoadingController } from 'ionic-angular';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages';
// services
import { CacheService } from '../../shared/cache/cache.service';
// pages
import { LeaderboardSettingsPage } from '../settings/leaderboard/leaderboard-settings.page';
import { LoginPage } from '../../pages/login/login';
import { TutorialPage } from '../settings/tutorial/tutorial.page';
import { TermConditionPage } from '../term-condition/term-condition.page';
@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  helpline = "help@practera.com";
  logoutMessage: any = loadingMessages.Logout.logout;
  settings = [];
  constructor(
    private cache: CacheService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private translationService: TranslationService,
    private appCtrl: App
  ) {}

  getUserEmail() {
    return this.cache.getLocalObject('email') || '';
  }

  goLeaderBoardSettings(){
    this.navCtrl.push(LeaderboardSettingsPage);
  }

  goToTutorial() {
    this.navCtrl.push(TutorialPage);
  }

  goToTermConditions() {
    this.navCtrl.push(TermConditionPage);
  }

  logout() {
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
