import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'spinwheel',
  templateUrl: './spinwheel.html'
})
export class SpinwheelComponent {
  constructor(
    public loadingCtrl: LoadingController,
    private gameService: GameService
  ) {}

  ionViewWillEnter() {
    /*this.gameService.getAchievements().subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });*/
  }

  retrieve() {}

  spin() {
  }

  stop() {
  }
}
