import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { ActivityService } from '../../../services/activity.service';
import { EventService } from '../../../services/event.service';
import { EventsViewPage } from '../view/events-view.page';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'events-list-page',
  templateUrl: 'list.html'
})
export class EventsListPage {

  constructor(
    public navCtrl: NavController,
    public eventService: EventService,
    public activityService: ActivityService,
    public loadingCtrl: LoadingController,
  ) {
  }

  loadedEvents = [];
  events = [];
  noEvents = false;
  filter = 'browses';


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
          return (moment(event.end).isAfter() && event.isBooked === false);
        }), 'start', 'asc');
        break;
    }

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

  // Check total of events, return "true" when 0 found
  showNoEventMessage() {
    return (this.noEvents);
  }


  loadEvents(): Promise<any> {
    return new Promise((resolve, reject) => {

      // Get activities IDs
      this.activityService.getList()
      .toPromise()
      .then((activities) => {
        let activityIDs = [];
        _.forEach(activities, (act) => {
          activityIDs.push(act.Activity.id);
        });

        // Get event by activityIDs
        this.eventService.getEvents({
          search: {
            activity_id: '[' + _.toString(activityIDs) + ']'
          }
        })
        .then((events) => {
          // After map event with activities,
          // assign events to 'events' and 'loadedEvents'

          // loadedEvents will never change,
          // it use to filtering events.
          this.loadedEvents = this._injectCover(
            this._mapWithActivity(events, activities)
          );

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
      this.loadEvents()
      .then(() => {
        loader.dismiss();
      })
      .catch((err) => {
        console.log(err);
        loader.dismiss();
      });
    });
  }

  doRefresh(e) {
    this.loadEvents()
    .then(() => {
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
      let idx = (key % 5) + 1;
      events[key].coverUrl = '/assets/img/static/event-cover-' + idx + '.jpg';
    });

    return events;
  }

  private _mapWithActivity(events, activities) {
    let result = [];

    events.forEach((event, key) => {
      let activity = _.find(activities, (actv) => {
        return actv.Activity.id === event.activity_id
      });

      if (activity) {
        events[key].activity = activity.Activity;
      }
      result.push(event);
    });

    return result;
  }

  // Check event allow to check-in
  allowCheckIn(event) {
    console.log('event', event);
    return (moment(event.start).isAfter() && moment(event.end).isBefore());
  }

  view(event) {
    /*if (this.allowCheckIn(event)) {
      alert('Going to check-in page...');
    } else {
      alert('This event not allow to check-in...');
    }*/
    console.log(event);
    this.navCtrl.push(EventsViewPage, {event: event});
  }
}
