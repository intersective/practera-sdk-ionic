import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule } from '@angular/common';

import { NotificationService } from './notification.service';
import { NotificationComponent } from './notification.component';
// import { ModalComponent } from './modal.component';

@NgModule({
  imports: [ CommonModule, IonicModule ],
  declarations: [
    NotificationComponent,
    // ModalComponent,
  ],
  providers: [ NotificationService ],
  exports: [
    NotificationComponent,
    // ModalComponent
  ]
})
export class NotificationModule {}
