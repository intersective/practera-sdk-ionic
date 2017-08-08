import { Component, Injectable } from '@angular/core';
import { ViewController, LoadingController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { i18nData } from '../../../app/i18n-en';
import { loadingMessages, errMessages } from '../../../app/messages';
@Injectable()
@Component({
  selector: 'items-popup',
  templateUrl: 'items-popup.html'
})
export class ItemsPopupPage {
  public combinedData: any = [];
  public isEmpty: boolean = null;
  public loadingMessage: any = loadingMessages.LoadingSpinner.loading;
  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    public translationService: TranslateService
  ) {
    // this.combinedData = [];
  }
  ionViewWillEnter(){
    this.combinedData = this.navParams.get('combined');
    console.log("popup combined data: ", this.combinedData);
    return this.combinedData.length == 0 ? this.isEmpty = true : this.isEmpty = false
  }
  // close disbaled activity popup
  closeModal() {
    this.viewCtrl.dismiss();
  }
}
