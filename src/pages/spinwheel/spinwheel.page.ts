import { Component, NgZone, OnInit, Renderer2, ElementRef } from '@angular/core';
import { LoadingController, Platform } from 'ionic-angular';
import { GameService } from '../../services/game.service';

import * as Winwheel from 'Winwheel';
import * as TweenMax from 'gsap';

// font size and test colour overridden on backrupt segments.
// hardcoded prize list
const POINTS = [
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
];

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
    'segments'        : POINTS,     // Define segments including colour and text.
    'animation' :           // Specify the animation to use.
    {
      'type'     : 'spinToStop',
      'duration' : 10,     // Duration in seconds.
      'spins'    : 3,     // Default number of complete spins.
      'callbackFinished' : this.alertPrize,
      'onComplete': this.onComplete
    }
  };
  wheel: any;
  canvasWidth: number = 300;
  canvasHeight: number = 500;
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
    let ionContentElement = this.renderer.selectRootElement('ion-content');

    let width = ionContentElement.clientWidth;
    this.canvasWidth = width * 0.9;

    let radius = this.canvasWidth / 2;
    // make canvas rectangle dynamically, so it do not crop spinwheel
    this.canvasHeight = width;
    this.canvasWheel.outerRadius = radius * 0.8;
    this.canvasWheel.innerRadius = radius * 0.2;
    console.log(width);
    console.log(this.canvasWidth);
  }

  alertPrize() {
    this.statuses.value += 100;
    console.log('hmmmm...... hahahahahahahah');
  }

  retrieve() {}

  private runInZone(cb) {
    this.zone.run(() => {
      cb();
    });
  }

  onComplete() {
    console.log('onCompleteha! gotcha!');
  }

  draw() {
    this.runInZone(() => {
      this.wheel = new Winwheel(this.canvasWheel);
      let test = this.wheel;
      console.log(this.onComplete);
      this.wheel.animation.callbackFinished = 'this.onComplete()';
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
      this.startAnimation();
      // this.wheel.startAnimation();
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

  startAnimation() {
    if (this.wheel.animation)
    {
        // Call function to compute the animation properties.
        this.wheel.computeAnimation();

        let animation = this.wheel.animation;
        var properties = {
          yoyo: animation.yoyo,
          repeat: animation.repeat,
          ease: animation.easing,
          onUpdate: this.onComplete,
          onComplete: this.onComplete
        };
        properties[`${animation.propertyName}`] = animation.propertyValue;

// var properties = new Array(null);
// properties[animation.propertyName] = animation.propertyValue; // Here we set the property to be animated and its value.
// properties['yoyo']       = animation.yoyo;     // Set others.
// properties['repeat']     = animation.repeat;
// properties['ease']       = animation.easing;
// properties['onUpdate']   = this.onComplete;   // Call function to re-draw the canvas.
// properties['onComplete'] = this.onComplete;

        // Do the tween animation passing the properties from the animation object as an array of key => value pairs.
        // Keep reference to the tween object in the wheel as that allows pausing, resuming, and stopping while the animation is still running.
        console.log(properties);

        let result = TweenMax.to(this.wheel, animation.duration, properties);
        console.log(result);

        this.wheel.tween = TweenMax.to(this.wheel, animation.duration, properties);
    }
  }
}
