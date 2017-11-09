import { Component, Output, EventEmitter } from '@angular/core';
import { Tabs, NavParams, NavController, AlertController, LoadingController, ActionSheetController, ToastController } from 'ionic-angular';

// services
import { AssessmentService } from '../../../services/assessment.service';
import { EventService } from '../../../services/event.service';
import { SubmissionService } from '../../../services/submission.service';
// pages
import { AssessmentsGroupPage } from '../../assessments/group/assessments-group.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { EventCheckinPage } from '../checkin/event-checkin.page';
import { EventsDownloadPage } from '../download/events-download.page';
import { EventsListPage } from '../list/list.page';
// Others
import { CacheService } from '../../../shared/cache/cache.service';
import { loadingMessages, errMessages } from '../../../app/messages';
import { TranslationService } from '../../../shared/translation/translation.service';
import * as moment from 'moment';

const terms = {
  booked: 'Booked'
};
@Component({
  templateUrl: './events-view.html'
})
export class EventsViewPage {
  booked_text: string = 'Booked';
  bookEventErrMessage: any = errMessages.Events.bookEvents.book;
  bookingStatus: string = '';
  cancelBookingErrMessage: any = errMessages.Events.cancelBooking.cancel;
  completedSubmissions: boolean = false;
  event: any = {};
  justBooked: boolean = false;
  loadings: any = { checkin: true };
  submissions: Array<any> = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public assessmentService: AssessmentService,
    public cache: CacheService,
    public eventService: EventService,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public navCtrl: NavController,
    public submissionService: SubmissionService,
    public toastCtrl: ToastController,
    public translationService: TranslationService
  ) {
    this.event = navParams.get('event');
  }

  availability(event): string {
    return (event.isBooked)? terms.booked : event.remaining_capacity + ' of ' + event.capacity + ' seats available';
  }

  ionViewWillEnter() {
    this.loadings.checkin = true;
    this.submissions = []; // reset submissions

    if (this.event.References) {
      this.event = Object.assign(this.event, this.extractAssessment(this.event.References));
    }

    if (this.event) {
      this.bookingStatus = this.availability(this.event);
    }
  }

  ionViewDidEnter() {
    this.completedSubmissions = false;
    this.submissionService.getSubmissions({
      context_id: this.event.context_id
    }).subscribe(res => {
      this.loadings.checkin = false;
      res.forEach(submission => {
        submission = this.submissionService.normalise(submission);
        this.submissions.push(submission);
        if (submission.status === 'done') {
          this.completedSubmissions = true;
        }
      });
    }, (err) => {
      this.loadings.checkin = false;
      console.log(err);
    });
  }

  /**
   * @name extractAssessment
   * @description each event has only one assessment
   * @param {Array} references References array response from get_activity API
   */

  extractAssessment(references: Array<any>) {
    let ref = references[0];
    ref.Assessment.context_id = ref.context_id;

    return {
      assessment: ref.Assessment,
      context_id: ref.context_id
    };
  }

  /**
   * Push Download page to ionic nav stack (navigate to attachment download page)
   */
  gotoDownload(event) {
    this.navCtrl.push(EventsDownloadPage, {event});
  }

  /**
   * Event booking function
   * @param {object} event Single event object from get_events API response
   */
  checkBookStatus() {
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
                      this.navCtrl.popToRoot(EventsListPage);
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
   * @note existence of References array determines if an event is
   *       a checkin type
   * @description examine event to allow check in
   * @param {Object} event
   */
  allowCheckIn(event) {
    if (event.References && event.References.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Event checkin action
   * @param {Object} event single event object return from get_event API
   */
  checkin(event) {
    let loading = this.loadingCtrl.create({
      content: 'loading checkin...'
    });
    loading.present().then(() => {
      // if submission exist
      loading.dismiss().then(() => {
        // this.navCtrl.push(AssessmentsGroupPage, {
        this.navCtrl.push(AssessmentsPage, {
          event,
          activity: event.activity,
          submissions: this.submissions
        });
      });
    })
  }

  /**
   * Event cancel booking action
   * @param
   */
  cancelBooking() {
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
                   this.navCtrl.popToRoot(EventsListPage);
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
