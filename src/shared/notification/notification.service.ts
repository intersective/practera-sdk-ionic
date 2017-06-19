import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { AlertController } from 'ionic-angular';

@Injectable()
export class NotificationService {

  private modalActivateSource = new Subject<any>();

  modalActivated$ = this.modalActivateSource.asObservable();

  constructor(public alertCtrl: AlertController) {}

  /**
   * Show alert on page
   * Refer: https://ionicframework.com/docs/api/components/alert/AlertController/
   * @param {Object} context
   * @example context
   *  {
   *    title: {String},
   *    subTitle: {String},
   *    button: {Array}, // ['OK', 'CANCEL']
   *  }
   */
  present(context: any) {
    this.modalActivateSource.next(context);
  }

  /**
   * pop up alert box with button
   * @param {Object} content to customise alert box
   */
  public alert(context: any = {
    title: 'Title',
    subTitle: 'Subtitle',
    buttons: ['OK']
  }) {
    let alert = this.alertCtrl.create(context);
    alert.present();
  }
}
