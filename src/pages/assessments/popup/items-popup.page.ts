import { Component, Injectable } from '@angular/core';
import { ViewController, LoadingController, NavParams, NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { i18nData } from '../../../app/i18n-en';
import { loadingMessages, errMessages } from '../../../app/messages';
import * as _ from 'lodash';
// pages 
import { TabsPage } from '../../../pages/tabs/tabs.page';
@Injectable()
@Component({
  selector: 'items-popup',
  templateUrl: 'items-popup.html'
})
export class ItemsPopupPage {
  public combinedData: any = [];
  public pageTitle: string = '';
  public isEmpty: boolean = null;
  public loadingMessage: any = loadingMessages.LoadingSpinner.loading;
  constructor(
    private viewCtrl: ViewController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    public translationService: TranslateService
  ) {}
  ionViewWillEnter(){
    if (!_.isEmpty(this.navParams.get('event'))) {
      this.pageTitle = 'Checkin Successful!';
    }else {
      this.pageTitle = 'Submit Success!';
    }
    this.combinedData = this.navParams.get('combined');
    console.log("popup combined data: ", this.combinedData);
    return this.combinedData.length == 0 ? this.isEmpty = true : this.isEmpty = false
  }
  // close disbaled activity popup
  closeModal() {
    this.viewCtrl.dismiss();
    this.navCtrl.setRoot(TabsPage);
  }
}
