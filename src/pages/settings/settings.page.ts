import { Component } from '@angular/core';
import { App, NavController, MenuController, LoadingController } from 'ionic-angular';
// services
import { CacheService } from '../../shared/cache/cache.service';
// pages
import { LeaderboardSettingsPage } from '../settings/leaderboard/leaderboard-settings.page';
import { LoginPage } from '../../pages/login/login';
import { TutorialPage } from '../settings/tutorial/tutorial.page';
import { TermsConditionsPage } from '../registration/terms-conditions/terms-conditions.page';
// Others
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  helpline: string = "help@practera.com";
  logoutMessage: any = loadingMessages.Logout.logout;
  settings: any = [];
  constructor(
    public appCtrl: App,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public cache: CacheService,
    public translationService: TranslationService) {}
  getUserEmail() {
    return this.cache.getLocal('email') || '';
  }

  goLeaderBoardSettings(){
    this.navCtrl.push(LeaderboardSettingsPage);
  }

  goToTutorial() {
    this.navCtrl.push(TutorialPage);
  }

  goToTermConditions() {
    this.navCtrl.push(TermsConditionsPage);
  }

  logout() {
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      content: this.logoutMessage
    });
    loader.present().then(() => {
      this.cache.clear().then(() => {
        loader.dismiss();
        this.navCtrl.push(LoginPage);
        localStorage.clear();
        window.location.reload(); // the reason of doing this is because of we need to refresh page content instead of API data cache issue occurs
      });
    });
  }
}
