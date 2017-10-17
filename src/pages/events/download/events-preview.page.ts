import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: './events-preview.html'
})
export class EventsPreviewPage implements OnInit {
  file: any = {};

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public viewCtrl: ViewController
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
