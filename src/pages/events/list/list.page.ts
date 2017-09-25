import { Component } from '@angular/core';
import { NavController, LoadingController, FabContainer } from 'ionic-angular';
import * as moment from 'moment';
import * as _ from 'lodash';
import { loadingMessages, errMessages } from '../../../app/messages';
// services
import { ActivityService } from '../../../services/activity.service';
import { EventService } from '../../../services/event.service';
// pages
import { EventsViewPage } from '../view/events-view.page';

// APIkey
import CONFIG from '../../../configs/config';

const LOCATIONS = [
  { code: 'SGS', name: 'Saigon' },
  { code: 'HN', name: 'Hanoi' },
];

@Component({
  selector: 'events-list-page',
  templateUrl: 'list.html'
})
export class EventsListPage {

  // https://process.filestackapi.com/
  imageAttrbutes: String = 'resize=width:400/output=f:png,q:70';
  // imageAttrbutes: String = 'resize=width:400/blur=amount:1/quality=value:85';
  bgImages: Array<String> = [
    `https://process.filestackapi.com/${CONFIG.filestack.apiKey}/${this.imageAttrbutes}/https://cdn.filestackcontent.com/XOlUDhe6SxmVTdhSd1h2`, // ppl coffee notes tea
    `https://process.filestackapi.com/${CONFIG.filestack.apiKey}/${this.imageAttrbutes}/https://cdn.filestackcontent.com/YjmteXrgSdz7QRG2P7Ng`, // hands ppl woman working
    `https://process.filestackapi.com/${CONFIG.filestack.apiKey}/${this.imageAttrbutes}/https://cdn.filestackcontent.com/HPSLbqb3Qp6B8JV2So9Y`, // coffee desk notes workplace
    `https://process.filestackapi.com/${CONFIG.filestack.apiKey}/${this.imageAttrbutes}/https://cdn.filestackcontent.com/UqH9EXiRtG7vLb48s7UN`, // ppl coffee tea meeting
    `https://process.filestackapi.com/${CONFIG.filestack.apiKey}/${this.imageAttrbutes}/https://cdn.filestackcontent.com/LGRR8ub1SM2G6tDaEPTS`, // ppl woman coffee meeting
  ];

  // loading & error message variables
  private emptyFilterErrMessage = errMessages.Events.filter.empty;
  private noBookingsFilterErrMessage = errMessages.Events.filter.noBookings;
  private noAttendedFilterErrMessage = errMessages.Events.filter.noAttended;

  locations = LOCATIONS; // preset hardcoded locations from const above
  fab: any = null;
  activities = {};
  events: Array<any> = []; // ordered events from filterEvents and to be access through template
  noEvents = false;
  filter = 'browses'; // currently support ['browses', 'attended', 'my-bookings']
  filterLocation: string = null; // default value for location filtration
  private loadedEvents = []; // Further processed events array, for private use

  constructor(
    public navCtrl: NavController,
    public eventService: EventService,
    public activityService: ActivityService,
    public loadingCtrl: LoadingController
  ) {}

  ionViewWillLeave() {
    if (this.fab) {
      console.log(this.fab);
      this.fab.close();
    }
  }

  /**
   * counter ionic's absent of event handling for ion-fab
   * without event handling, we can't know when the fab button is pressed with which value
   */
  setIonFab(e, fab: FabContainer) {
    this.fab = fab;
  }

  /**
   * @name filterEvents
   * @description filter and group events into 3 catergories (attended, my-bookings, browses)
   * attended: expired & booked
   * my-bookings: active event & booked
   * browses: list of available events
   */
  filterEvents() {
    this.noEvents = false;
    switch(this.filter) {
      case 'attended':
        // List all ended event in order of end time (desc)
        this.events = _.orderBy(_.filter(this.loadedEvents, (event) => {
          return (event.isBooked === true && moment().isAfter(moment(event.end)));
        }), 'start', 'desc');
        break;
      case 'my-bookings':
        // List all booked event in order of start time (desc)
        this.events = _.orderBy(_.filter(this.loadedEvents, (event) => {
          return (event.isBooked === true && moment().isBefore(moment(event.end)));
        }), 'start', 'asc');
        break;
      case 'browses':
        // List all not booked and not ended event in order of start time (asc)
        this.events = _.orderBy(_.filter(this.loadedEvents, (event) => {
          // return (moment(event.end).isAfter() && event.isBooked === false);
          // return (moment().isBefore(moment(event.end)) && event.isBooked === false);
          return (moment(event.end).isAfter() && event.isBooked === false);
        }), 'start', 'asc');
        break;
    }

    // filter locations (if this.filterLocation is valid)
    if (this.filterLocation) {
      this.events = _.filter(this.events, ['location', this.filterLocation]);
    }

    // toggle noEvents: boolean based on length of this.events
    if (this.events.length === 0) {
      this.noEvents = true;
    }
    return this.events;
  }

  // Called when tap on filter tab
  selected(filter) {
    this.filter = filter;
    this.events = this.filterEvents();
  }

  /**
   * filtration of location
   * @param {string}       filter keywords (currently support: 'all', 'hanoi', 'saigon')
   * @param {FabContainer} fab
   */
  selectedLocation(filter: string, fab? : FabContainer) {
    this.filterLocation = filter;

    if (filter) {
      if (fab) {
        fab.close();
      }
    }

    if (fab) { // if filter is empty but fab is clicked
      this.fab = fab;
      if (fab._listsActive) {
        fab.close();
      }
    }

    this.filterEvents();
  }

  // Check total of events, return "true" when 0 found
  showNoEventMessage() {
    return (this.noEvents);
  }

  /**
   * @name loadEvents
   * @description retrieve events (from get_events) with a list of activity_id (from get_activity)
   * @return {Promise<any>}
   */
  loadEvents(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Get activities IDs
      this.activityService.getList().toPromise()
      .then((activities) => {
        this.activities = {};
        let activityIDs = [];
        _.forEach(activities, (act) => {
          this.activities[act.Activity.id] = act;
          activityIDs.push(act.Activity.id);
        });

        // Get event by activityIDs
        this.eventService.getEvents({
          search: {
            activity_id: '[' + _.toString(activityIDs) + ']',
            type: 'session'
          }
        })
        .then((events) => {
          // loadedEvents will never change (private use),
          // it will be used for filtering of events (prep for display/template variable).
          this.loadedEvents = this._injectCover(this._mapWithActivity(events));

          // events use to rendering on page
          this.events = _.clone(this.loadedEvents);
          this.filterEvents();
          return resolve();
        }, reject);
      }, reject);
    });
  }

  ionViewDidEnter() {
    let loader = this.loadingCtrl.create();

    loader.present().then(() => {
      this.loadEvents().then(() => {
        loader.dismiss();
      })
      .catch((err) => {
        console.log(err);
        loader.dismiss();
      });
    });
  }

  doRefresh(e) {
    this.loadEvents().then(() => {
      e.complete();
    })
    .catch((err) => {
      console.log('err', err);
      e.complete();
    });
  }
  /**
   * @TODO: remove this once we decided to remove hardcoded images, big size picture is ruining UX because it induces long download time
   *
   * @name _injectCover
   * @description inject hardcoded images by array index number
   * @param {array} events list of event object respond from get_events API
   */
  private _injectCover(events) {
    let counts = events.length;

    _.forEach(events, (value, key) => {
      let idx = (key % 5);
      events[key].coverUrl = this.bgImages[idx];
      // let idx = (key % 5) + 1;
      // events[key].coverUrl = '/assets/img/static/event-cover-' + idx + '.jpg';
    });

    return events;
  }

  /**
   * @TODO: we need abbreviation "SGS" & "HN" (Saigon and Hanoi), DB doesn't has this data, so it's hardcoded for this stage
   * @name _extractLocations
   * @description Extract uniq location from events
   * @param {array} events list of event object respond from get_events API
   */
  private _extractLocations(events) {
    return _.map(_.uniqBy(events, 'location'), 'location');
  }

  /**
   * @name _mapWithActivity
   * @description
   *     - attach "activity" object into each of single "event" object
   *     - Extract and merge event-activity only
   *     - skip non-event activities
   * @param {array} events get_events response
   */
  private _mapWithActivity(events) {
    let result = [];

    result = events.map(event => {
      let thisActivity = this.activities[event.activity_id];
      thisActivity.References = event.References; // must use event's references
      return _.merge(event, {
        activity: this.activityService.normaliseActivity(thisActivity)
      });
    });

    return result;
  }
  // Check event allow to check-in
  allowCheckIn(event) {
    return (moment(event.start).isAfter() && moment(event.end).isBefore());
  }

  view(event) {
    this.navCtrl.push(EventsViewPage, {
      event
    });
  }
}
