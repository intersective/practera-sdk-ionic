import { Component, NgZone, OnInit, ElementRef } from '@angular/core';
import { AlertController, LoadingController, Platform, ModalController, Events } from 'ionic-angular';
import { GameService } from '../../services/game.service';
import { CacheService } from '../../shared/cache/cache.service';
import { loadingMessages } from '../../app/messages';

import * as _ from 'lodash';
import * as Winwheel from 'winwheel';
import { TweenLite } from "gsap";

@Component({
  templateUrl: './spinwheel.html',
  styleUrls: ['./spinwheel.scss']
})
export class SpinwheelPage implements OnInit {
  // hardcode prizes
  segments = {
    general: [
      {'fillStyle' : '#00B5AD', 'text' : '100', 'value' : 100},
    ],
    normal: [
      {'fillStyle' : '#FFCB05', 'text' : '200', 'value' : 200},
    ],
    rare: [
      {'fillStyle' : '#FCAC75', 'text' : '300', 'value' : 300},
    ],
    ultimate: [
      {'fillStyle' : '#E60028', 'text' : '400', 'value' : 400}
    ]
  };

  config = {
    'canvasId'        : 'spinwheel',
    'outerRadius'     : 150,
    'innerRadius'     : 50,
    'textFontSize'    : 24,
    'textOrientation' : 'vertical',
    'textAlignment'   : 'outer',
    'numSegments'     : 12,
    'segments'        : this.getSegments(),
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

  public wheel: any;
  statuses = {
    chances: 0,
    power: 0,
    value: 0,
    spinOn: false,
    displayPureCSS: false,
    isSpinning: false,
    isCompleted: false,
    totalEP: 0, // for display (updated only after done spinning)
    newTotalEP: 0 // for reset of totalEP after spinning,
  };
  canvas = {
    width: 0,
    height: 0
  };

  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public platform: Platform,
    private gameService: GameService,
    private zone: NgZone,
    private el: ElementRef,
    private cache: CacheService,
    private modalCtrl: ModalController,
    private eventListener: Events
  ) {
    platform.ready().then(() => {
      this.canvas = {
        width: platform.width() * 0.9,
        height: platform.width(),
      };
    });
  }

  ionViewDidEnter() {
    this.draw();
  }

  // @TODO: split this into useful functions
  // api calls
  game: any = {};
  character: any = {};
  item: any = {};
  calls(types) {
    let gameId = null;
    let characterId = null;

    switch (types) {
      case "game":
        this.gameService.getGames().subscribe(res => {
          console.log(res);
          this.game = res.Games[0];
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
          this.retrieve().then(res => {
            // prepare unopened containers
            let unopened = [];
            res.Containers.forEach(container => {
              if (!container.opened) {
                unopened.push(container);
              }
            });

            // prepare available spinners
            let spinners = [];
            if (unopened.length > 0) {
              res.Items.forEach(item => {
                if (item.id === unopened[0].item_id) {
                  spinners.push(item);
                }
              });
            }

            if (spinners.length > 0) {
              this.item = spinners[0]; // get first spinner
            } else {
              let alert = this.alertCtrl.create({
                title: 'No available spin left!',
                buttons: ['Ok']
              });
              alert.present();
            }
          })
        }
        break;

      case "my_item":
          this.retrieve({
            filter: "items_all"
          }).then(res => {
            console.log(res);
          });
        break;

      case "open":
        if (this.item.id === null) {
          console.log('load item API first!');
        } else {
          this.gameService.postItems({
            "Character": {
              "id": this.cache.getLocal('character_id')
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

    let character = this.cache.getLocalObject('character');
    this.statuses.totalEP = character.experience_points || 0;
  }

  /**
   * @name getSegments
   * @description
   *  font size and test colour overridden on backrupt segments.
   *  atm, we hardcode prizes and communicate with server on the final result
   */
  private getSegments() {
    let segments = this.segments;

    let result = [];
    result = result.concat(segments.ultimate);

    for (let x = 0; x < 5; x++) {
      // general
      result = result.concat(segments.general);

      // normal
      if (x < 4) {
        result = result.concat(segments.normal);
      }

      // rare
      if (x === 0 || x === 2) {
        result = result.concat(segments.rare);
      }

    }

    return result;
  }

  retrieve(options = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      options = Object.assign({
        character_id: this.cache.getLocal('character_id')
      }, options);

      if (this.cache.getLocal('character_id')) {
        this.gameService.getItems(options).subscribe(res => {
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
   * @description display activity detail modal page
   */
  private openAlert(content?) {
    let spinner = Object.assign({
      name: 'Congratulations',
      description: ''
    }, content || {});

    let spinnerAlert = this.alertCtrl.create({
      title: 'Congratulations',
      cssClass: 'custom-alert',
      subTitle: spinner.description
    });
    spinnerAlert.present();
  }

  private setCanvasSize() {
    let width = this.platform.width(),
      canvasWidth = width * 0.9,
      canvasHeight = width;

    // radius X 2 < max-width of ion-content
    let radius = canvasWidth / 2;
    let radiusConfig = {
      outer: radius * 0.8,
      inner: radius * 0.25
    };
    // this.statuses.centerLogoSize = `${radiusConfig.inner * 2}px`;

    this.config.outerRadius = radiusConfig.outer;
    this.config.innerRadius = radiusConfig.inner;

    if (this.wheel) {
      if (this.wheel.canvas) {
        // make canvas size responsive
        this.wheel.canvas.width = canvasWidth;
        this.wheel.canvas.height = canvasHeight;
      }
      this.wheel.outerRadius = radiusConfig.outer;
      this.wheel.innerRadius = radiusConfig.inner;
    } else {
      this.canvas = {
        width: canvasWidth,
        height: canvasHeight
      };
    }
  }

  /**
   * @name draw
   * @description draw SpinWheel canvas based on given config
   */
  draw() {
    this.setCanvasSize();
    this.wheel = new Winwheel(this.config);
    this.wheel.draw();

    this.statuses.chances = (this.getUnopened()).length;
  }

  private getUnopened(retrievedContainer?) {
    let containers = retrievedContainer || this.cache.getLocalObject('containers');

    let unopened = [];
    containers.forEach(container => {
      if (!container.opened) {
        unopened.push(container);
      }
    });

    return unopened;
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
  stopAt(itemId): Promise<any> {
    return new Promise((resolve, reject) => {
      // Get random angle inside specified segment of the wheel.
      // let segmentNumber = Math.floor((Math.floor(Math.random() * 1000) / 100) % 12) + 1;

      this.gameService.postItems({
        "Character": {
          "id": this.cache.getLocal('character_id')
        },
        "Item": {
          "id": itemId // ID of the item to take action
        }
      }).subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }

  /**
   * @name spin
   * @description check conditions fulfillment before spinning allowed
   * @returns {void}
   */
  spin() {
    /*let segmentNumber = (400/ 100);
    let stopAt = this.wheel.getRandomForSegment(segmentNumber);

    this.wheel.animation.stopAngle = stopAt;
    this.wheel.rotationAngle = 0; // reset starting point of spinner
    this.startAnimation();*/

    let loading = this.loadingCtrl.create({
      content: loadingMessages.LoadingSpinner.loading
    }),
    alert = this.alertCtrl.create({
      buttons: ['Ok']
    });

    loading.present();
    this.retrieve().then(res => {

      this.eventListener.publish('spinner:update', res); // update badge

      // prepare unopened containers
      let unopened = this.getUnopened(res.Containers);

      // prepare available spinners
      let spinners = [];
      if (unopened.length > 0) {
        res.Items.forEach(item => {
          if (item.id === unopened[0].item_id) {
            spinners.push(item);
          }
        });
      }

      if (spinners.length > 0) {
        this.item = spinners[0]; // get first spinner
        this.stopAt(this.item.id).then(res => {
          loading.dismiss();

          this.statuses.newTotalEP = res.total_experience_points;

          let relatedSegments = [];
          this.wheel.segments.forEach(segment => {
             if (segment && segment.value === res.total_experience_points) {
               relatedSegments.push(segment);
             }
          });

          let segment = relatedSegments[Math.floor(Math.random() * relatedSegments.length)];
          let stopAt = this.getRandomForSegment(segment);

          this.wheel.animation.stopAngle = stopAt;
          this.wheel.rotationAngle = 0; // reset starting point of spinner
          this.startAnimation();
          this.retrieve().then((updated) => {
            // Updated again the tab badge number
            console.log('After spin update', updated);
            this.eventListener.publish('spinner:update', updated);
          });
        }, err => {
          loading.dismiss();
          alert.data.title = 'Fail to communicate with server';
          alert.present();
          console.log(err);
        });

      } else {
        // Force to zero
        this.eventListener.publish('spinner:update', res);
        loading.dismiss();
        alert.data.title = 'No spin chances available!';
        alert.present();
      }
    }, err => {
      loading.dismiss();
      alert.data.title = 'Insufficient Spin Chances';
      alert.present();
    });
  }

  /**
   * @name finaliseSpinner
   * @description finalise computation of end result of spinwheel
   */
  finaliseSpinner() {
    let prize = this.wheel.getIndicatedSegment();
    this.statuses.value += prize.value;

    let characterEP = this.cache.getLocalObject('character');
    this.statuses.totalEP = characterEP.experience_points + this.statuses.newTotalEP; // display new total EP
    this.openAlert({description: `Congratulations you’ve won ${prize.value} points.`});
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

      this.stopAnimation();
      this.finaliseSpinner();
    };

    // template logic
    this.statuses.isSpinning = true;
    this.statuses.chances -= 1;

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

  private getRandomForSegment(segmentObject) {
    let stopAngle = 0;

    if (typeof segmentObject !== 'undefined') {
      let startAngle = segmentObject.startAngle;
      let endAngle = segmentObject.endAngle;
      let range = (endAngle - startAngle) - 2;

      if (range > 0) {
        stopAngle = (startAngle + 1 + Math.floor((Math.random() * range)));
      } else {
        throw 'Segment size is too small to safely get random angle inside it';
      }
    }

    return stopAngle;
  }
}
