import { Component } from '@angular/core';
import { App, NavController, MenuController, LoadingController, AlertController } from 'ionic-angular';

// services
import { CacheService } from '../../shared/cache/cache.service';
import { GameService } from '../../services/game.service';
// pages
import { LoginPage } from '../../pages/login/login';
import { TutorialPage } from '../settings/tutorial/tutorial.page';
import { TermConditionPage } from '../term-condition/term-condition.page';
// Others
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages } from '../../app/messages';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  helpline: string = "help@practera.com";
  hideName: boolean = false;
  logoutMessage: any = loadingMessages.Logout.logout;
  settings: any = [];

  constructor(
    public appCtrl: App,
    public alertCtrl: AlertController,
    public cacheService: CacheService,
    public gameService: GameService,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public translationService: TranslationService,
  ) {}

  ionViewWillEnter(){
    this.preload();
  }

  preload() {
    const loading = this.loadingCtrl.create({
      content: 'Loading'
    });
    loading.present();

    let gameId = this.cacheService.getLocal('game_id');
    this.gameService.getCharacters(gameId)
      .subscribe((characters) => {
        let me = characters.Characters[0];
        if(me.meta == null) {
          this.hideName = false;
        }
        if(me.meta != null){
          if (me.meta.private === 0) {
            this.hideName = false;
          } else {
            this.hideName = true;
          }
        }
        loading.dismiss();
      }, (err) => {
        loading.dismiss();
      });
  }

  triggerHideName() {
    const showAlert = (msg) => {
      let alert = this.alertCtrl.create({
        subTitle: msg,
        buttons: ['OK']
      });
      alert.present();
    }

    const loader = this.loadingCtrl.create({
      content: 'Updating'
    });

    loader.present().then(() => {
      this.gameService.postCharacter({
        Character: {
          id: this.cacheService.getLocal('character_id'),
          meta: {
            private: (this.hideName) ? 1 : 0
          }
        }
      })
      .subscribe((result) => {
        loader.dismiss();
        let msg = 'You name will now be hidden if in the ranking';
        if (!this.hideName) {
          msg = 'Your name will now be displayed if in the ranking';
        }
        showAlert(msg);
      }, (err) => {
        this.hideName = !this.hideName;
        showAlert('Unabled to change your privacy setting.');
        loader.dismiss();
      });
    });
  }

  getUserEmail() {
    return this.cacheService.getLocal('email') || '';
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
      this.cacheService.clear().then(() => {
        localStorage.clear();
        window.location.reload(); // the reason of doing this is because of we need to refresh page content instead of API data cache issue occurs
        loader.dismiss();
        this.navCtrl.push(LoginPage);
      });
    });
  }
}
