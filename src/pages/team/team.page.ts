import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { TeamService } from '../../services/team.service';
// Others
import * as _ from 'lodash';

@Component({
  selector: 'team-page',
  templateUrl: 'team.html'
})
export class TeamPage {
  members = [];
  team = {};

  constructor(
    public navCtrl: NavController,
    public teamService: TeamService,
    public toastCtrl: ToastController
  ) {}



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

  _pullData(refresher?) {
    // @TODO Need inject user team ID
    this.teamService.getTeam()
    .then((result: any) => {
      this.team = result.team;
      this.members = result.members;

      if (refresher) {
        refresher.complete();
      }
    })
    .catch((err) => {
      if (refresher) {
        refresher.complete();
      }
      this._error(err);
    });
  }

  doRefresh(refresher) {
    this._pullData(refresher);
  }

  ionViewWillEnter() {
    this._pullData();
    this.members = [
      {
        name: 'Jose',
        email: 'abcd.example.cc'
      }
    ]
  }
}
