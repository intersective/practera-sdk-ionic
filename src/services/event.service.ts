import { Injectable }    from '@angular/core';
import { URLSearchParams } from '@angular/http';

// others
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class EventService {
  bookEventUrl = 'api/book_events.json';
  targetUrl = 'api/events.json';

  constructor(
    public cache: CacheService,
    public request: RequestService
  ) {}

  /**
   * @description Normalise event
   * @param {[events]} events data from API
   */

  _normalise(events) {
    _.forEach(events, (event, idx) => {
      events[idx].isAttended = (event.isBooked === true && moment().isAfter(moment(event.end)));
      // We assume server datetime response is UTC...
      events[idx].startDisplay = moment.utc(event.start).local().format("dddd, MMM D [at] h:mm A");
      events[idx].startDisplayDate = moment.utc(event.start).local().format("dddd, MMM D");
      events[idx].startDisplayTime = moment.utc(event.start).local().format("h:mm A");
      events[idx].endDisplay = moment.utc(event.end).local().format("dddd, MMM D [at] h:mm A");
      events[idx].endDisplayDate = moment.utc(event.end).local().format("dddd, MMM D");
      events[idx].endDisplayTime = moment.utc(event.end).local().format("h:mm A");
    });

    return events;
  }

  /**
   * @description Get events data
   * @param {object} options
   */

  getEvents(options: Object = {}) {
    options = _.merge({
      search: {
        type: 'session'
      }
    }, options);

    return this.request.get(this.targetUrl, options)
    .map(this._normalise)
    .toPromise();
  }

  /**
   * @description download attachment by single event object
   * @param {[type]} event [description]
   */

  downloadAttachment(event) {
    let url = event.fileUrl;
    // var blob = new Blob([data], { type: 'text/csv' });
    // var url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  /**
   * @description get event using observable
   * @param {integer} eventId single event id
   */

  bookEvent(eventId) {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('event_id', eventId);
    return this.request.post(this.bookEventUrl, urlSearchParams);
  }

  /**
   * @description cancel booked event
   * @param {integer} eventId single event id
   */

  cancelEventBooking(eventId) {
    return this.request.delete(this.bookEventUrl + '?event_id=' + eventId);
  }

  /**
   * @description Get session events
   * @param {[integer]} activityIDs
   */

  getUserEvents(activityIDs) {
    return this.request.get(this.targetUrl+`?type=session&activity_id=[${activityIDs}]`);
  }
}
