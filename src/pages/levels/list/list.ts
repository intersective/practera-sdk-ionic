import { Component } from '@angular/core';
import { NavController, ToastController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';

import { LevelService } from '../../../services/level.service';

@Component({
  selector: 'levels-list-page',
  templateUrl: 'list.html'
})
export class LevelsListPage {

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public toastCtrl: ToastController,
    public levelService: LevelService,
  ) {
      platform.ready().then(() => {});
  }

  private _mock = [
    {
      id: 1,
      name: 'Rookie'
    },
    {
      id: 2,
      name: 'Cookie'
    }
  ];

  public levels = [];

  // @TODO: Move to shared function later...
  private _error(err) {
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

  private _pullData(refresher = null) {
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

  public doRefresh(refresher) {
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
