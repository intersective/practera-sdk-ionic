import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: './spinwheel-popover.html',
  styleUrls: ['./spinwheel-popover.scss']
})

export class SpinwheelPopOverPage implements OnInit {
  status = {
    withSpin: 'Start earning points by <strong>swiping</strong> or <strong>tap</strong> to spin',
    withoutSpin: 'Earn spins by attending an event or completing a submission'
  };
  statusText: string;

  constructor(public viewCtrl: ViewController) {}

  ngOnInit() {
    let data = this.viewCtrl.data;
    this.statusText = this.status[`${data.statusText}`];
  }
}
