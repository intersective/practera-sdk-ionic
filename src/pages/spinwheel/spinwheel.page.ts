import { Component, NgZone, OnInit, Renderer2, ElementRef } from '@angular/core';
import { LoadingController, Platform } from 'ionic-angular';
import { GameService } from '../../services/game.service';
import { TweenMax } from 'gsap';

import * as Winwheel from 'Winwheel';

@Component({
  templateUrl: './spinwheel.html',
  styleUrls: ['./spinwheel.scss']
})
export class SpinwheelPage implements OnInit {
  canvasWheel = {
    'canvasId'        : 'spinwheel',
    'outerRadius'     : 150,        // Set outer radius so wheel fits inside the background.
    'innerRadius'     : 50,         // Make wheel hollow so segments don't go all way to center.
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
    spinOn: false,
    displayPureCSS: false
  };

  constructor(
    public loadingCtrl: LoadingController,
    private gameService: GameService,
    private zone: NgZone,
    private renderer: Renderer2,
    private el: ElementRef,
    private platform: Platform
  ) {
  }

  ngOnInit() {
    // preset values
    this.statuses.chances = 10;
    this.statuses.value = 0;
    this.statuses.spinOn = true;

  }

  ionViewWillEnter() {
    console.log(this.renderer.selectRootElement('ion-content'));

    let width = this.platform.width();
    this.canvasWidth = width * 0.9;
console.log('width', width);
console.log('canvasWidth', this.canvasWidth);
    let canvasWidth = width * 0.8;
    // this.canvasWheel.outerRadius = canvasWidth*0.7;
    // this.canvasWheel.innerRadius = canvasWidth*0.3;
console.log('canvasWheel', this.canvasWheel);
console.log('wheel', this.wheel);
  }

  alertPrize() {
    this.statuses.value += 100;
  }

  retrieve() {}

  private runInZone(cb) {
    this.zone.run(() => {
      cb();
    });
  }

  draw() {
    this.runInZone(() => {
      this.wheel = new Winwheel(this.canvasWheel);
      this.wheel.draw();
      console.log('drawn!!!');
      console.log(this.wheel);
    });
  }

  // pause
  pause() {
    this.runInZone(() => {
      this.wheel.pause();
    });
  }

  // resume
  play() {
    this.runInZone(() => {
      this.wheel.play();
    });
  }

  // reset
  /**
   * reset: required before 2nd spin
   */
  reset() {
    this.runInZone(() => {
      this.wheel.stopAnimation(true);  // Stop the animation, false as param so does not call callback function.
      // this.wheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
      this.wheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
      this.wheel.draw();                // Call draw to render changes to the wheel.
    });
  }

  clear() {
    this.wheel.clearCanvas();
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


  // pure CSS drawing
  createSlice() {
    let result = `
      <div>
        <h2>Daylights<i class="fa fa-lightbulb-o"></i></h2>
      </div>
    `;
  }

  // draw pure CSS spinwheel
  drawPureCSS() {
    this.statuses.displayPureCSS = true;

    var duration = Math.floor(Math.random() * 4) + 1;
    var degrees = 360 * (Math.random() * 10);

    // $('#outcome-icon').removeClass('fa-hand-' + selectedOutcome.toLowerCase()  + '-o');
    // $('#outcome-name').text('');
    let el = this.renderer.selectRootElement('.wheelContainer .gameWheel');
    let slices = [
      {id: 'rock', class: 'slide1', text: 'RockS'},
      {id: 'paper', class: 'slide2', text: 'PaperS'},
      {id: 'scissors', class: 'slide3', text: 'ScissorsS'},
      {id: 'lizard', class: 'slide4', text: 'LizardS'}
    ];

    slices.forEach((slice) => {
      let newSlice = this.renderer.createElement('div');
      this.renderer.addClass(newSlice, 'slice');
      this.renderer.addClass(newSlice, slice.class);
      this.renderer.setProperty(newSlice, 'id', slice.id);

      let newSliceChild = this.renderer.createElement('h2');
      this.renderer.setValue(newSliceChild, slice.text);
      let test2 = this.renderer.appendChild(newSlice, newSliceChild);

      let test = this.renderer.appendChild(el, newSlice);
      console.log(newSlice, test);
    });

    /*TweenMax.to('.gameWheel', duration,  {rotation: degrees}).eventCallback("onComplete", function(){
      for (var i = 0; i < slices.length; i++) {
        var $slice = $(slices[i]);
        var topPosition = $slice.position().top;

        if (topPosition < 0.3) {
          break;
        }

        if (topPosition < 5) {
          $slice.addClass('selected');
          break;
        }
      }
    });*/
  }
}
