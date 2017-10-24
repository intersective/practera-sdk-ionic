import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'level',
  templateUrl: 'level.html'
})
export class LevelComponent {
  @Input() level;

  constructor(
    public navCtrl: NavController
  ) {}

  public gotoLevel(levelId) {
    // this.navCtrl.push(levelDetail);
  }
}
