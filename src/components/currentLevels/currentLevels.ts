import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as _ from 'lodash';

import { LevelService } from '../../services/level.service';

@Component({
  selector: 'current-levels',
  templateUrl: 'currentLevels.html'
})
export class CurrentLevelsComponent {

  public levels = [
    {
      id: 1,
      name: 'Level 1 (Fake)',
    }
  ];

  constructor(
    public navCtrl: NavController,
    public levelService: LevelService,
  ) {}

  ionViewDidEnter() {
    this.levelService.getLevels()
    .then((result: any) => {
      const level: any = _.find(result.data, { is_locked: false });

      if (level) {
        this.levels.push(level);
      }
    })
    .catch((err) => {
      // @TODO handle error UI...
      console.log('err', err)
    });
  }

}
