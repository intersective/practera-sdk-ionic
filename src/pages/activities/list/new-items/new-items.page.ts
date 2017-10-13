import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { CacheService } from '../../../../shared/cache/cache.service';

@Component({
  templateUrl: 'new-items.html'
})
export class NewItemsPage {
  newItemsData: any = [];

  constructor(
    public cacheService: CacheService,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.newItemsData = this.params.get('newItemsData');

    // Remove data in localstorage
    this.cacheService.setLocalObject('allNewItems', []);
    this.cacheService.setLocal('gotNewItems', false);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
