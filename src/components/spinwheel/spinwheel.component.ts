import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { LoadingController, Platform } from 'ionic-angular';
import { GameService } from '../../services/game.service';
import { TweenMax } from 'gsap';

import * as Winwheel from 'Winwheel';

@Component({
  selector: 'spinwheel',
  templateUrl: './spinwheel.html'
})
export class SpinwheelComponent implements OnInit {
  canvasWheel = {
    'canvasId'        : 'spinwheel',
    'outerRadius'     : 80,        // Set outer radius so wheel fits inside the background.
    'innerRadius'     : 20,         // Make wheel hollow so segments don't go all way to center.
    'textFontSize'    : 24,         // Set default font size for the segments.
    'textOrientation' : 'vertical', // Make text vertial so goes down from the outside of wheel.
    'textAlignment'   : 'outer',    // Align text to outside of wheel.
    'numSegments'     : 12,         // Specify number of segments.
    'segments'        :             // Define segments including colour and text.
    [                               // font size and test colour overridden on backrupt segments.
       {'fillStyle' : '#97ACD9', 'text' : '100'},
       {'fillStyle' : '#ABE0F9', 'text' : '200'},
       {'fillStyle' : '#96D5D2', 'text' : '300'},
       {'fillStyle' : '#C4DF9F', 'text' : '400'},
       {'fillStyle' : '#97ACD9', 'text' : '100'},
       {'fillStyle' : '#ABE0F9', 'text' : '200'},
       {'fillStyle' : '#96D5D2', 'text' : '300'},
       {'fillStyle' : '#C4DF9F', 'text' : '400'},
       {'fillStyle' : '#97ACD9', 'text' : '100'},
       {'fillStyle' : '#ABE0F9', 'text' : '200'},
       {'fillStyle' : '#96D5D2', 'text' : '300'},
       {'fillStyle' : '#C4DF9F', 'text' : '400'}
    ],
    'animation' :           // Specify the animation to use.
    {
      'type'     : 'spinToStop',
      'duration' : 10,     // Duration in seconds.
      'spins'    : 3,     // Default number of complete spins.
      'callbackFinished' : this.alertPrize
    }
  };
  wheel: any;
  canvasWidth: number = 300;
  statuses = {
    chances: 0,
    spinning: false,
    power: 0,
    value: 0,
    spinOn: false
  };

  constructor(
    public loadingCtrl: LoadingController,
    private gameService: GameService,
    private zone: NgZone,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    let width = this.platform.width();
    this.canvasWidth = width * 0.8;

    let canvasWidth = width * 0.5;
    this.canvasWheel.outerRadius = canvasWidth*0.75;
    this.canvasWheel.innerRadius = canvasWidth*0.2;
    this.wheel = new Winwheel(this.canvasWheel);
    console.log(this.wheel);
  }

  ionViewWillEnter() {
    // preset values
    this.statuses.chances = 10;
    this.statuses.value = 0;
    this.statuses.spinOn = true;

    /*this.gameService.getAchievements().subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    });*/
  }

  ionViewDidEnter() {
  }

  alertPrize() {
    this.statuses.value += 100;
  }

  retrieve() {}

  draw() {
    this.zone.run(() => {
      this.wheel.draw();
      console.log('drawn!!!');
      console.log(this.wheel);
    });
  }

  spin() {
    this.zone.run(() => {
      let segmentNumber = 70/100;

      // Get random angle inside specified segment of the wheel.
      let stopAt = this.wheel.getRandomForSegment(segmentNumber);

      // Important thing is to set the stopAngle of the animation before stating the spin.
      this.wheel.animation.stopAngle = stopAt;
      this.wheel.startAnimation();
    });
  }

  stop() {
  }

  powerSelected() {
    // Ensure that power can't be changed while wheel is spinning.
    if (this.statuses.spinning == false) {
      this.statuses.spinOn = true;
    } else {
      this.statuses.spinOn = false;
    }
  }
}
