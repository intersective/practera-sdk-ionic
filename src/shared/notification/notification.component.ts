import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { NotificationService } from './notification.service';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-notification',
  template: ``,
})
export class NotificationComponent {

  constructor(
    public modalCtrl: ModalController,
    public notificationService: NotificationService
  ) {
    notificationService.modalActivated$.subscribe(
      context => {
        this.show(context)
      }
    );
  }

  ngOnInit() {}

  /**
   * Show notification modal
   * @param {Object} context
   * @example context
   * {
   *    title: {String},
   *    notification_icon: ?{String},
   *    description: {String},
   *    score: ?{String},
   *    button_label: ?{String},
   *    button_function: ?{Function},
   *    button_link: ?{String},
   * }
   */
  show(context: any) {
    let modal = this.modalCtrl.create(ModalComponent, { 'context': context });
    modal.present();
  }
}
