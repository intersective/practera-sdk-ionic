import { Component } from '@angular/core';
import { App, NavController, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages';
// services
import { GameService } from '../../services/game.service';
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
  public helpline = "personaledge@rmit.edu.vn";
  public logoutMessage: any = loadingMessages.Logout.logout;
  public hideMe: boolean;
  constructor(
    private cache: CacheService,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public translationService: TranslationService,
    private appCtrl: App,
    private gameService: GameService
  ) {}
  public settings = [];
  ionViewWillEnter() {
    if (this.navCtrl.getPrevious() !== undefined) {
      // Move to dashboard
      this.navCtrl.parent.select(0);
    } else {
      const loading = this.loadingCtrl.create();
      loading.present();

      let gameId = this.cache.getLocalObject('game_id');
      this.gameService.getCharacters(gameId)
        .subscribe((characters) => {
          let me = characters.Characters[0];
          console.log("me: ", me);
          if(me.meta == null){
            this.hideMe = false;
          }
          if(me.meta != null){
            if (me.meta.private === 0) {
              this.hideMe = false;
            } else {
              this.hideMe = true;
            }
          }
          loading.dismiss();
        }, (err) => {
          console.log('err', err);
          loading.dismiss();
        });
    }
  }
  public getUserEmail() {
    return this.cache.getLocalObject('email') || '';
  }
  public changePrivate() {
    const showAlert = (msg) => {
      let alert = this.alertCtrl.create({
        subTitle: msg,
        buttons: ['OK']
      });
      alert.present();
    }
    const loader = this.loadingCtrl.create();
    loader.present()
    .then(() => {
      this.gameService.postCharacter({
        Character: {
          id: this.cache.getLocalObject('character_id'),
          meta: {
            private: (this.hideMe) ? 1 : 0
          }
        }
      })
      .subscribe((result) => {
        loader.dismiss();
        let msg = 'You name will now be hidden if in the leaderboard';
        if (!this.hideMe) {
          msg = 'Your name will now be displayed if in the leaderboard';
        }
        showAlert(msg);
      }, (err) => {
        this.hideMe = !this.hideMe;
        showAlert('Unabled to change your privacy setting.');
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
