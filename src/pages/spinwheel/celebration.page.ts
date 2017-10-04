import { Component, Renderer2, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TweenLite } from "gsap";
import * as _ from 'lodash';

// some constants
const DECAY = 4;        // confetti decay in seconds
const SPREAD = 60;      // degrees to spread from the angle of the cannon
const GRAVITY = 1200;

@Component({
  templateUrl: './celebration.html',
  styleUrls: ['./celebration.scss']
})
export class CelebrationPage implements OnInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;

  ctx: CanvasRenderingContext2D;
  canvas;
  dpr;
  confettiSpriteIds;
  confettiSprites;
  drawVector;
  vector;
  pointer;
  timer;

  ngOnInit() {
    // setup a canvas
    let newCanvas = this.renderer.createElement('canvas');
    let rootDiv = this.renderer.selectRootElement('#newThing');

    this.renderer.setAttribute(newCanvas, 'width', '500px');
    this.renderer.setAttribute(newCanvas, 'height', '500px');

    this.ctx = newCanvas.getContext('2d');
    this.canvas = newCanvas;

    // Obtain screen size/ratio for scaling purpose
    this.dpr = window.devicePixelRatio || 1;
    this.ctx.scale(this.dpr, this.dpr);

    // vector line representing the firing angle
    this.drawVector = false;
    this.vector = [{
        x: window.innerWidth,
        y: window.innerHeight * 1.25,
    }, {
        x: window.innerWidth,
        y: window.innerHeight * 2,
    }];

    this.pointer = {};

    // bind methods
    this.canvasResize = this.canvasResize.bind(this);

    this.setupListeners();
    this.canvasResize();

    this.renderer.appendChild(rootDiv, newCanvas);
  }

  // utilities
  getLength(x0, y0, x1, y1) {
    // returns the length of a line segment
    const x = x1 - x0;
    const y = y1 - y0;
    return Math.sqrt(x * x + y * y);
  }

  getDegAngle(x0, y0, x1, y1) {
    const y = y1 - y0;
    const x = x1 - x0;
    return Math.atan2(y, x) * (180 / Math.PI);
  }

  constructor(
    private renderer: Renderer2
  ) {
  }

  setupListeners() {
    // bind events
    window.addEventListener('resize', this.canvasResize);
  }

  canvasResize() {
  }
}
