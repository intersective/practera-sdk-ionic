import { Component, Output, EventEmitter } from '@angular/core';
import { Tabs, NavParams, NavController, AlertController, LoadingController, ActionSheetController, ToastController } from 'ionic-angular';
import { loadingMessages, errMessages } from '../../../app/messages';
import { TranslationService } from '../../../shared/translation/translation.service';
// services
import { CacheService } from '../../../shared/cache/cache.service';
import { EventService } from '../../../services/event.service';
import { AssessmentService } from '../../../services/assessment.service';
import { SubmissionService } from '../../../services/submission.service';

// pages
import { EventsListPage } from '../list/list.page';
import { EventsDownloadPage } from '../download/events-download.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { AssessmentsGroupPage } from '../../assessments/group/assessments-group.page';
import { EventCheckinPage } from '../checkin/event-checkin.page';

// We no need custom page for checkin anymore
// import { EventCheckinPage } from '../checkin/event-checkin.page';

import * as moment from 'moment';

const terms = {
  booked: 'Booked'
};
@Component({
  templateUrl: './events-view.html'
})
export class EventsViewPage {
  public loadings = {
    checkin: true
  };
  public event: any;
  public bookingStatus: string = '';
  public justBooked: boolean = false;
  public booked_text: string = 'Booked';
  public bookEventErrMessage: any = errMessages.Events.bookEvents.book;
  public cancelBookingErrMessage: any = errMessages.Events.cancelBooking.cancel;
  private submissions: Array<any> = [];
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private cache: CacheService,
    private eventService: EventService,
    public translationService: TranslationService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private assessmentService: AssessmentService,
    private submissionService: SubmissionService
  ) {
    this.event = navParams.get('event');
  }

  private availability(event): string {
    return (event.isBooked)? terms.booked : event.remaining_capacity + ' of ' + event.capacity + ' seats available';
  }

  ionViewWillEnter() {
    this.loadings.checkin = true;
    if (this.event.References) {
      this.event = Object.assign(this.event, this.extractAssessment(this.event.References));
    }

    if (this.event) {
      this.bookingStatus = this.availability(this.event);
    }
  }

  ionViewDidEnter() {
    this.submissionService.getSubmissions({
      search: {
        context_id: this.event.context_id
      }
    }).subscribe(res => {
      this.loadings.checkin = false;
      res.forEach(submission => {
        this.submissions.push(this.submissionService.normalise(submission));
      });
    }, err => {
      this.loadings.checkin = false;
      console.log(err);
    });
  }

  /**
   * @name extractAssessment
   * @description each event has only one assessment
   * @param {Array} references References array response from get_activity API
   */
  private extractAssessment(references: Array<any>) {
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
      console.log(this.submissions);
      if (this.submissions.length > 0) {
        loading.dismiss();
        this.navCtrl.push(EventCheckinPage, {event: this.event});
      } else { // get assessment and go checkin
        this.assessmentService.getAll({
          search: {
            assessment_id: this.event.assessment.id,
            structured: true
          }
        }).subscribe(assessments => {
          let assessment = assessments[0],
              assessmentGroup = assessment.AssessmentGroup[0];

          loading.dismiss().then(() => {
            this.navCtrl.push(AssessmentsGroupPage, {
              event,
              assessment: assessment.Assessment,
              assessmentGroup: assessmentGroup
            })
          });
        }, err => { loading.dismiss(); });
      }
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
