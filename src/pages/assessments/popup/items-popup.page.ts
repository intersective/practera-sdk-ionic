import { Component, Injectable } from '@angular/core';
import { ViewController, LoadingController, NavParams, NavController } from 'ionic-angular';

import { i18nData } from '../../../app/i18n-en';
import { loadingMessages, errMessages } from '../../../app/messages';
import * as _ from 'lodash';
// services
import { CacheService } from '../../../shared/cache/cache.service';
import { TranslateService } from '@ngx-translate/core';
// pages
import { TabsPage } from '../../../pages/tabs/tabs.page';
@Injectable()
@Component({
  selector: 'items-popup',
  templateUrl: 'items-popup.html'
})
export class ItemsPopupPage {

  combinedData: any = [];
  loadingMessage: any = loadingMessages.LoadingSpinner.loading;

  constructor(
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private cacheService: CacheService,
    private translationService: TranslateService
  ) {}

  ionViewWillEnter(){
    this.combinedData = this.cacheService.getLocalObject('allNewItems');
  }

  /**
   * @description close disbaled activity popup
   */
  closeModal() {
    this.viewCtrl.dismiss();
    this.navCtrl.setRoot(TabsPage);
  }
}
