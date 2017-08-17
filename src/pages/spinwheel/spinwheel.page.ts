import { Component, NgZone, OnInit, Renderer2 } from '@angular/core';
import { AlertController, LoadingController } from 'ionic-angular';
import { GameService } from '../../services/game.service';
import { CacheService } from '../../shared/cache/cache.service';
import { loadingMessages } from '../../app/messages';

import * as Winwheel from 'Winwheel';
import { TweenLite } from "gsap";

@Component({
  templateUrl: './spinwheel.html',
  styleUrls: ['./spinwheel.scss']
})
export class SpinwheelPage implements OnInit {
  // hardcode prizes
  segments = [
    {'fillStyle' : '#97ACD9', 'text' : '100', 'value' : 100},
    {'fillStyle' : '#ABE0F9', 'text' : '200', 'value' : 200},
    {'fillStyle' : '#96D5D2', 'text' : '300', 'value' : 300},
    {'fillStyle' : '#C4DF9F', 'text' : '400', 'value' : 400}
  ];

  config = {
    'canvasId'        : 'spinwheel',
    'outerRadius'     : 150,
    'innerRadius'     : 50,
    'textFontSize'    : 24,
    'textOrientation' : 'vertical',
    'textAlignment'   : 'outer',
    'numSegments'     : 12,
    'segments'        : this.getSegments(3),
    'rotationAngle'   : -15,
    'animation' : {
      'type'     : 'spinToStop',
      'direction': 'clockwise',
      'propertyName': 'rotationAngle',
      'easing'   : 'Power4.easeOut',
      'duration' : 10, // Duration in seconds.
      'spins'    : 3, // Default number of complete spins.
    }
  };

  public wheel: any = {};
  canvasWidth: number = 300;
  canvasHeight: number = 500;
  statuses = {
    chances: 0,
    power: 0,
    value: 0,
    spinOn: false,
    displayPureCSS: false,
    isSpinning: false,
    isCompleted: false
  };

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private gameService: GameService,
    private zone: NgZone,
    private renderer: Renderer2,
    private cache: CacheService
  ) {
  }

  // @TODO: split this into useful functions
  // api calls
  game: any = {};
  character: any = {};
  item: any = {};
  calls(types) {

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

    // make canvas size responsive
    this.canvasHeight = width;
    this.config.outerRadius = radius * 0.8;
    this.config.innerRadius = radius * 0.2;
  }

  /**
   * @name getSegments
   * @description
   *  font size and test colour overridden on backrupt segments.
   *  atm, we hardcode prizes and communicate with server on the final result
   */
  private getSegments(repeatable: number = 1) {
    let segments = this.segments;

    let result = [];
    for (let x = 0; x < repeatable; x++) {
      result = result.concat(segments);
    }
    return result;
  }

  retrieve(type): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.cache.getLocal('character_id')) {
        this.gameService.getItems({
          character_id: this.character.id
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
      } else {
        this.gameService.getGames({
          character_id: this.game.id
        }).subscribe(res => {
          console.log(res);
          // this.gameService.getCharacters()
          resolve(res);
        }, err => {
          reject(err);
        });
      }
    });
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
    this.wheel.draw(true);
  }

  /**
   * @name reset
   * @description reset: required before 2nd spin
   */
  reset() {
    this.runInZone(() => {
      this.stopAnimation();
      this.wheel.clearCanvas();
      this.wheel.rotationAngle = this.config.rotationAngle;
      this.draw();
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

  /**
   * @TODO: integrate get prize from server first
   * @name stopAt
   * @description this function should communicate with server
   */
  stopAt() {
    let loading = this.loadingCtrl.create({
      content: loadingMessages.LoadingSpinner.loading
    });

    /*loading.present();
    this.retrieve('items').then(res => {
      loading.dismiss();
    }, err => {
      loading.dismiss();
    });*/

    // Get random angle inside specified segment of the wheel.
    let segmentNumber = Math.floor((Math.floor(Math.random() * 1000) / 100) % 12) + 1;
    let stopAt = this.wheel.getRandomForSegment(segmentNumber);
  }

  /**
   * @name spin
   * @description check conditions fulfillment before spinning allowed
   * @returns {void}
   */
  spin() {
    // check animation is allowed/activated
    if (this.wheel.animation && this.statuses.chances > 0) {
      this.wheel.animation.stopAngle = this.stopAt();
      this.wheel.rotationAngle = 0; // reset starting point of spinner
      this.startAnimation();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Insufficient Spin Chances',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  /**
   * @name finaliseSpinner
   * @description finalise computation of end result of spinwheel
   */
  finaliseSpinner() {
    let prize = this.wheel.getIndicatedSegment();
    this.statuses.value += prize.value;
  }

  /**
   * @name startAnimation
   * @description
   *   similar startAnimation replace WinWheel library's animation trigger
   *   this will also use current context of TweenLite to run gsap animation
   */
  private startAnimation() {
    // gsap callback: triggered after spin is complete
    let onComplete = () => {
      this.statuses.isSpinning = false;
      this.statuses.isCompleted = true;
      this.statuses.chances -= 1;

      this.stopAnimation();
      this.finaliseSpinner();
    };

    // template logic
    this.statuses.isSpinning = true;

    // Call function to compute the animation properties.
    this.wheel.computeAnimation();

    let animation = this.wheel.animation,
    properties: any = {
      yoyo: animation.yoyo,
      repeat: animation.repeat,
      ease: animation.easing,
      onUpdate: this.winwheelAnimationLoop,
      onUpdateScope: this.wheel,
      onComplete: onComplete
    };
    properties[`${animation.propertyName}`] = animation.propertyValue;
    this.wheel.tween = TweenLite.to(this.wheel, animation.duration, properties);
  }

  /**
   * @name winwheelAnimationLoop
   * @description re-draw by following new changes/update on wheel config
   */
  winwheelAnimationLoop() {
    let wheel = this;
    let self = wheel.wheel || wheel;

    if (self) {
      // Check if the clearTheCanvas is specified for this animation, if not or it is not false then clear the canvas.
      if (self.animation.clearTheCanvas != false) {
          self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
      }
      self.draw(false);
    }
  }
}
