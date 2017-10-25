import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';

// Services
import { LevelService } from '../../../services/level.service';

@Component({
  selector: 'levels-list-page',
  templateUrl: 'list.html'
})
export class LevelsListPage {
  _mock = [
    {
      id: 1,
      name: 'Rookie'
    },
    {
      id: 2,
      name: 'Cookie'
    }
  ];
  levels = [];

  constructor(
    public navCtrl: NavController,
    public levelService: LevelService,
    public platform: Platform,
    public toastCtrl: ToastController
  ) {
      platform.ready().then(() => {});
  }

  // @TODO: Move to shared function later...
  _error(err) {
    let toast = this.toastCtrl.create({
      message: err,
      duration: 5000,
      position: 'bottom',
      dismissOnPageChange: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  _pullData(refresher = null) {
    return this.levelService.getLevels()
      .then((levels: any) => {
        this.levels = levels;
        if (refresher) {
          refresher.complete();
        }
      })
      .catch((err) => {
        this._error(err);
        console.log('err', err);
        if (refresher) {
          refresher.complete();
        }
      });
  }

  doRefresh(refresher) {
    this._pullData(refresher);
    // @TODO Remove it when API work
    this.levels = this._mock;
  }

  ionViewWillEnter() {
    this._pullData();
    // @TODO Remove it when API work
    this.levels = this._mock;
  }
}
