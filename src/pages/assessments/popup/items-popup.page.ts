import { Component, Injectable } from '@angular/core';
import { ViewController, LoadingController, NavParams, NavController } from 'ionic-angular';

// services
import { CacheService } from '../../../shared/cache/cache.service';
import { TranslateService } from '@ngx-translate/core';
// pages
import { TabsPage } from '../../../pages/tabs/tabs.page';
// Others
import { i18nData } from '../../../app/i18n-en';
import { loadingMessages, errMessages } from '../../../app/messages';
import * as _ from 'lodash';

@Injectable()
@Component({
  selector: 'items-popup',
  templateUrl: 'items-popup.html'
})
export class ItemsPopupPage {
  public combinedData: any = [];
  public loadingMessage: any = loadingMessages.LoadingSpinner.loading;

  constructor(
    public cacheService: CacheService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public translationService: TranslateService,
    public viewCtrl: ViewController
  ) {}

  ionViewWillEnter() {
    this.combinedData = this.cacheService.getLocal('allNewItems');
  }

  // close disbaled activity popup
  closeModal() {
    this.viewCtrl.dismiss();
    this.navCtrl.setRoot(TabsPage);
  }
}
