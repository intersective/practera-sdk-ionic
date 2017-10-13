import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'new-items.html'
})
export class NewItemsPage {
  newItemsData: any;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.newItemsData = this.params.get('newItemsData');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
