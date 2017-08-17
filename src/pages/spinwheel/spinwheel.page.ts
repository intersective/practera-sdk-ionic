import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { LoadingController, Platform } from 'ionic-angular';
import { GameService } from '../../services/game.service';
import { CacheService } from '../../shared/cache/cache.service';
import { WindowRef } from '../../shared/window';

import * as Winwheel from 'Winwheel';
// import {TweenLite, Power2, TimelineMax, TweenMax} from "gsap";
import { TweenLite } from "gsap";


@Component({
  templateUrl: './spinwheel.html',
  styleUrls: ['./spinwheel.scss']
})
export class SpinwheelPage implements OnInit {
  // font size and test colour overridden on backrupt segments.
  // hardcoded prize list
  segments = [
     {'fillStyle' : '#97ACD9', 'text' : '100', 'value' : 100},
     {'fillStyle' : '#ABE0F9', 'text' : '200', 'value' : 200},
     {'fillStyle' : '#96D5D2', 'text' : '300', 'value' : 300},
     {'fillStyle' : '#C4DF9F', 'text' : '400', 'value' : 400},
     {'fillStyle' : '#97ACD9', 'text' : '100', 'value' : 100},
     {'fillStyle' : '#ABE0F9', 'text' : '200', 'value' : 200},
     {'fillStyle' : '#96D5D2', 'text' : '300', 'value' : 300},
     {'fillStyle' : '#C4DF9F', 'text' : '400', 'value' : 400},
     {'fillStyle' : '#97ACD9', 'text' : '100', 'value' : 100},
     {'fillStyle' : '#ABE0F9', 'text' : '200', 'value' : 200},
     {'fillStyle' : '#96D5D2', 'text' : '300', 'value' : 300},
     {'fillStyle' : '#C4DF9F', 'text' : '400', 'value' : 400}
  ];

  config = {
    'canvasId'        : 'spinwheel',
    'outerRadius'     : 150,        // Set outer radius so wheel fits inside the background.
    'innerRadius'     : 50,         // Make wheel hollow so segments don't go all way to center.
    'textFontSize'    : 24,         // Set default font size for the segments.
    'textOrientation' : 'vertical', // Make text vertial so goes down from the outside of wheel.
    'textAlignment'   : 'outer',    // Align text to outside of wheel.
    'numSegments'     : 12,         // Specify number of segments.
    'segments'        : this.segments,     // Define segments including colour and text.
    'rotationAngle'   : -15,
    /*'pointerGuide'    : {
        'display'     : true,
        'strokeStyle' : 'red',
        'lineWidth'   : 3
    },*/
    'animation' :           // Specify the animation to use.
    {
      'type'     : 'spinToStop',
      // 'direction': 'anti-clockwise',
      'direction': 'clockwise',
      'propertyName': 'rotationAngle',
      'easing'   : 'Power4.easeOut',
      'duration' : 10,     // Duration in seconds.
      'spins'    : 3,     // Default number of complete spins.
      // 'callbackFinished' : this.alertPrize
    }
  };
  public wheel: any = {};
  canvasWidth: number = 300;
  canvasHeight: number = 500;
  statuses = {
    chances: 0,
    spinning: false,
    power: 0,
    value: 0,
    spinOn: false,
    displayPureCSS: false,
    isCompleted: false,
    isStarted: false,
  };

  constructor(
    public loadingCtrl: LoadingController,
    private gameService: GameService,
    private zone: NgZone,
    private renderer: Renderer2,
    private cache: CacheService,
    private platform: Platform,
    public win: WindowRef
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

    // radius X 2 < max-width of ion-content
    let radius = this.canvasWidth / 2;

    // make canvas rectangle dynamically, so it do not crop spinwheel
    this.canvasHeight = width;
    this.config.outerRadius = radius * 0.8;
    this.config.innerRadius = radius * 0.2;
  }

  changeSegmentsText(newText) {
    this.runInZone(() => {
      this.wheel.segments.forEach((segment, index) => {
        if (segment) {
          this.wheel.segments[index].text = newText;
        }
      })

      this.wheel.draw();
    });
  }

  // api calls
  game: any = {};
  character: any = {};
  item: any = {};
  calls (types) {

    let gameId = null;
    let characterId = null;
    let itemId = null;

    switch (types) {
      case "game":
        this.gameService.getGames().subscribe(res => {
          console.log(res);
          this.game = res.Games[0];
          /*
            {
              "Games": [
                {
                  "id": 1,
                  "name": "PE-TEST Project",
                  "created": "2017-08-04 08:00:08.865691",
                  "modified": "2017-08-04 08:00:08.865691"
                }
              ]
            }
           */
        });
        break;

      case "character":
        if (this.game.id === null) {
          console.log('load game API first!');
        } else {
          this.gameService.getCharacters(this.game.id).subscribe(res => {
            console.log(res);
            this.character = res.Characters[0];
          });
        }
        break;

      case "item":
        if (this.character.id === null) {
          console.log('load character API first!');
        } else {
          this.gameService.getItems({
            character_id: this.character.id,
            action: 'list'
          }).subscribe(res => {
            this.item = res.Items[0];
            console.log(res);
            /*
              {
                "Containers": [
                  {
                    "id": 1,
                    "item_id": 1,
                    "opened": true
                  }
                ],
                "Items": [
                  {
                    "id": 1,
                    "name": "default inventory",
                    "description": "This is the default inventory of the game. This item cannot be deleted or edited.",
                    "meta": null,
                    "base_value": "0",
                    "container_id": null,
                    "experience_points": 0
                  }
                ]
              }
             */
          });
        }
        break;

      case "open":
        if (this.item.id === null) {
          console.log('load item API first!');
        } else {
          this.gameService.postItems({
            "Character": {
              "id": this.character.id
            },
            "Item": {
              "id": this.item.id,     // ID of the item to take action
            }
          }).subscribe(res => {
            console.log(res);
          });
        }
        break;
      default:
          console.log('nothing loaded');
        break;
    }
  }

  alertPrize() {
    this.statuses.value += 100;
    console.log('hmmmm...... hahahahahahahah');
  }

  retrieve() {
    if (this.cache.getLocal('character_id')) {
      this.gameService.getItems({
        character_id: this.character.id
      }).subscribe(res => {
        console.log(res);
      });
    } else {
      this.gameService.getGames({
        character_id: this.game.id
      }).subscribe(res => {
        console.log(res);
        // this.gameService.getCharacters()
      }, err => {
        console.log(err);
      })
    }
  }

  /**
   * @description ensure WinWheel library code run under the watch of angular
   * @param {Function} cb callback function run under ngZone's watch
   */
  private runInZone(cb) {
    this.zone.run(() => {
      cb();
    });
  }

  /**
   * @name draw
   * @description draw SpinWheel canvas based on given config
   */
  draw() {
    this.wheel = new Winwheel(this.config);
    // this.runInZone(() => {
      let test = this.wheel;
      console.log(this.wheel);
    // });
  }

  // redraw spinner (SVG)
  drawSpinner(clearCanvas) {
    this.runInZone(() => {
      this.wheel.draw(clearCanvas);
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
      this.wheel.tween.play();
    });
  }

  // reset
  /**
   * reset: required before 2nd spin
   */
  reset() {
    this.runInZone(() => {
      this.wheel.clearCanvas();
      this.stopAnimation();
      this.wheel.rotationAngle = this.config.rotationAngle;
      this.draw();
      let test = this.wheel;
      console.log(test);
    });
  }



  clear() {
    this.wheel.clearCanvas();
    this.wheel.canvas.kill();
    this.wheel.tween.kill();
  }

  stoppingAngle: number = 0;
  spin() {
    this.runInZone(() => {
      // Get random angle inside specified segment of the wheel.
      let segmentNumber = Math.floor((Math.floor(Math.random() * 1000) / 100) % 12) + 1;
      let stopAt = this.wheel.getRandomForSegment(segmentNumber);
console.log('please stop at segmentNumber::', segmentNumber);
console.log('stopAt angle::', stopAt);

      // this.wheel.rotationAngle = stopAt;
      // Important thing is to set the stopAngle of the animation before stating the spin.
      // this.wheel.animation.stopAngle = stopAt;
      this.startAnimation();
      // this.wheel.startAnimation();
    });
  }

  powerSelected() {
    // Ensure that power can't be changed while wheel is spinning.
    if (this.statuses.spinning == false) {
      this.statuses.spinOn = true;
    } else {
      this.statuses.spinOn = false;
    }
  }

  finalisingSpinner() {
    // let segment = this.wheel.segments;
    let test = this.wheel;
    console.log(test);
    let prize = this.wheel.getIndicatedSegment();
    console.log(prize);
    this.statuses.value += prize.value;

    /*if (prize.value) {
      this.changeSegmentsText(String(prize.value));
    }*/
  }

  onUpdate() {
    console.log('updated!');
    console.log('onupdate this::', this);
  }

  /**
   * @name startAnimation
   * @description
   *   similar startAnimation replace WinWheel library's animation trigger
   *   this will also use current context of TweenLite to run gsap animation
   */
  startAnimation() {
    // gsap callback: triggered when spin started
    let onStart= () => {
      console.log('im started!');
      this.statuses.isStarted = true;
      this.statuses.isCompleted = false;

      let test = this.wheel;
      console.log(test);
    };

    // gsap callback: triggered after spin is complete
    let onComplete = () => {
      console.log('onCompleteha! gotcha!');
      this.statuses.isStarted = false;
      this.statuses.isCompleted = true;
      this.statuses.chances -= 1;


      this.stopAnimation();  // Stop the animation, false as param so does not call callback function.
      // this.wheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
      // this.wheel.draw();                // Call draw to render changes to the wheel.

      let test = this.wheel;
      console.log(test);
      this.finalisingSpinner();
    };

    this.runInZone(() => {

      // check animation is allowed/activated
      if (this.wheel.animation && this.statuses.chances > 0) {
          // Call function to compute the animation properties.
          // console.log('before compute::', this.wheel);
          console.log('before compute, propertyVal::', this.wheel.animation.propertyValue);
          this.wheel.computeAnimation();
          // console.log('after compute::', this.wheel);
          console.log('after compute, propertyVal::', this.wheel.animation.propertyValue);

          let animation = this.wheel.animation,
          properties: any = {
            yoyo: animation.yoyo,
            repeat: animation.repeat,
            ease: animation.easing,
            onStart: onStart,
            onUpdate: this.winwheelAnimationLoop,
            onUpdateScope: this.wheel,
            onComplete: onComplete
          };
          properties['rotationAngle'] = animation.propertyValue;
          // properties[`${animation.propertyName}`] = animation.propertyValue;
          // properties['rotation'] = animation.propertyValue;


          console.log('animation::', this.wheel);
          console.log('Rotate::', animation.propertyValue);
          this.wheel.tween = TweenLite.to(this.wheel, animation.duration, properties);

          // test code
          let test = this.wheel;
          console.log(test);
      }
    });
  }

  stopAnimation() {
    this.runInZone(() => {
      if (this.wheel.tween) {
        this.wheel.tween.kill();
        console.log('animation stopped');
      }
    });
  }

  tween: any;
  winwheelAnimationLoop() {
    let wheel = this;

/*    if (!self.tween) {
      throw "TweenMax not found!";
    }
*/
    let self = wheel.wheel || wheel;
    console.log('rotationAngle', self.rotationAngle);
    if (self) {
      // Check if the clearTheCanvas is specified for this animation, if not or it is not false then clear the canvas.
      if (self.animation.clearTheCanvas != false)
      {
          self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      }

      // If there is a callback function which is supposed to be called before the wheel is drawn then do that.
      if (self.animation.callbackBefore != null)
      {
         self.animation.callbackBefore();
      }

      // Call code to draw the wheel, pass in false as we never want it to clear the canvas as that would wipe anything drawn in the callbackBefore.
      self.draw(false);

      // If there is a callback function which is supposed to be called after the wheel has been drawn then do that.
      if (self.animation.callbackAfter != null)
      {
          self.animation.callbackAfter();
      }
    }
  }

  restart() {
    if (this.wheel.tween) {
      this.wheel.tween.restart();
    } else {
      throw 'Tween doesnt exist!';
    }
  }
}
