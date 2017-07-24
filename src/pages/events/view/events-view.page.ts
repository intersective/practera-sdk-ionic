import { Component, Output, EventEmitter } from '@angular/core';
import { Tabs, NavParams, NavController, AlertController, LoadingController, ActionSheetController, ToastController } from 'ionic-angular';
import { loadingMessages, errMessages } from '../../../app/messages'; 
import { TranslationService } from '../../../shared/translation/translation.service';
// services
import { CacheService } from '../../../shared/cache/cache.service';
import { EventService } from '../../../services/event.service';
// pages
import { EventsListPage } from '../list/list.page';
import { EventsDownloadPage } from '../download/events-download.page';
import { EventCheckinPage } from '../checkin/event-checkin.page';
import * as moment from 'moment';

const terms = {
  booked: 'Booked'
};
@Component({
  templateUrl: './events-view.html'
})
export class EventsViewPage {
  public event: any;
  public bookingStatus: string = '';
  public justBooked: boolean = false;
  public booked_text: string = 'Booked';
  public bookEventErrMessage: any = errMessages.Events.bookEvents.book;
  public cancelBookingErrMessage: any = errMessages.Events.cancelBooking.cancel;
  constructor(
    private params: NavParams,
    private nav: NavController,
    private cache: CacheService,
    private eventService: EventService,
    public translationService: TranslationService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private tab: Tabs
  ) {
    this.event = params.get('event');
  }
  private availability(event): string {
    return (event.isBooked)? terms.booked : event.remaining_capacity + ' of ' + event.capacity + ' seats available';
  }
  ionViewDidEnter() {
    this.event = this.params.get('event');
    console.log('ionViewDidEnter', this.event);
    if (this.event) {
      this.bookingStatus = this.availability(this.event);
    }
  }
  /**
   * Push Download page to ionic nav stack (navigate to attachment download page)
   */
  gotoDownload(event) {
    this.nav.push(EventsDownloadPage, {event});
  }
  /**
   * Event booking function
   * @param {object} event Single event object from get_events API response
   */
  checkBookStatus(){
    return false ? (this.event.remaining_capacity == this.event.capacity && this.event.isBooked == false) : (this.event.remaining_capacity != this.event.capacity && this.event.isBooked == true)
  }
  book(event): void {
    let earnPoints = this.alertCtrl.create({
      message: `<div class="earn-points-box"><h4>Congratulations!</h4><br><img src="./assets/img/success-logo.png" alt="Congratulations logo"><p>You have earned 20 points.</p></div>`,
      buttons: [
        {
          text: 'OK',
          role: 'OK',
          handler: () => {
            console.log('OK, points earned');
          }
        }
      ]
    });
    let bookLoading = this.loadingCtrl.create({
      content: 'Booking ..'
    });
    let bookFailed = this.toastCtrl.create({
      message: this.bookEventErrMessage,
      duration: 5000,
      position: 'bottom'
    });
    let bookPopup = this.actionSheetCtrl.create({
      title: `Do you want to book a seat for ${ this.event.title } at ${ moment.utc(this.event.start).local().format("dddd, MMM D [at] h:mm A") }?`,
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.bookingStatus = this.availability(this.event);
          }
        },
        {
          text: 'Confirm',
          role: 'OK',
          handler: () => {
            bookLoading.present();
            this.eventService.bookEvent(this.event.id)
                .subscribe(
                  data => {
                    this.justBooked = true;
                    if(this.justBooked == true) {
                      this.booked_text;
                    }
                    bookLoading.dismiss().then(() => {
                      this.nav.popToRoot(EventsListPage);
                    });
                  },
                  err => {
                    bookLoading.dismiss().then(() => {
                      bookFailed.present();
                    });
                  }
                );
          }
        },
      ]
    });
    bookPopup.present();
  }
  /**
   * Event checkin action
   * @param
   */
  checkin(){
    // this.nav.push(EventCheckinPage, {event: this.event});
  }
  /**
   * Event cancel booking action
   * @param
   */
  cancelBooking(){
    let cancelLoading = this.loadingCtrl.create({
      content: 'Cancel Booking ..'
    });
    let cancelFailed = this.toastCtrl.create({
      message: this.cancelBookingErrMessage,
      duration: 5000,
      position: 'bottom'
    });
    let cancelBooking = this.actionSheetCtrl.create({
      title: 'Cancel Booking Of This Event?',
      buttons: [
        {
          text: 'Cancel Booking',
          role: 'destructive',
          handler: () => {
            cancelLoading.present();
            this.eventService.cancelEventBooking(this.event.id)
                .subscribe(
                  data => {
                    cancelLoading.dismiss().then(() => {
                     this.nav.popToRoot(EventsListPage);
                    });
                  },
                  err => {
                    cancelLoading.dismiss().then(() => {
                      cancelFailed.present();
                    });
                  }
                )
          }
        },
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            // console.log('Close this window ..');
          }
        }
      ]
    });
    cancelBooking.present();
  }
}
