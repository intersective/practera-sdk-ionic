import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: './events-preview.html'
})
export class EventsPreviewPage implements OnInit {
  file: any = {};

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private viewCtrl: ViewController
  ) {
  }

  ngOnInit() {
    this.viewCtrl.setBackButtonText('Done');
  }

  ionViewDidEnter() {
    this.file = this.navParams.get('file');
  }

  goBack() {
    this.navCtrl.pop();
  }
}
