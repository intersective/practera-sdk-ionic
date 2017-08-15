import { Component } from '@angular/core';
import { App, NavController, MenuController, LoadingController } from 'ionic-angular';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages';
// services
import { CharacterService } from '../../services/character.service';
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
  public helpline = "help@practera.com";
  public logoutMessage: any = loadingMessages.Logout.logout;
  public hideMe = true;
  constructor(
    private cache: CacheService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    public translationService: TranslationService,
    public characterService: CharacterService,
    private appCtrl: App
  ) {}
  public settings = [];
  public getUserEmail() {
    return this.cache.getLocalObject('email') || '';
  }
  public changePrivate() {
    let loader = this.loadingCtrl.create();
    loader.present()
    .then(() => {
      console.log('hideMe', this.hideMe);
      this.characterService.postCharacter({
        Character: {
          id: this.cache.getLocalObject('character_id'),
          meta: {
            private: (this.hideMe) ? 1 : 0
          }
        }
      })
      .subscribe((character) => {
        console.log('character', character);
        loader.dismiss();
      }, (err) => {
        console.log('err', err);
        loader.dismiss();
      });
    });
  }
  public goLeaderBoardSettings() {
    this.navCtrl.push(LeaderboardSettingsPage);
  }
  public goToTutorial() {
    this.navCtrl.push(TutorialPage);
  }
  public goToTermConditions() {
    this.navCtrl.push(TermConditionPage);
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
