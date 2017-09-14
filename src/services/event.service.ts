import { Injectable }    from '@angular/core';
import { URLSearchParams } from '@angular/http';
// services
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class EventService {
  private targetUrl = 'api/events.json';
  private bookEventUrl = 'api/book_events.json';
  constructor(private request: RequestService,
              private cache: CacheService) {}

  public getEvents(options: Object = {}) {
    options = _.merge({
      search: {
        type: 'session'
      }
    }, options);

    return this.request.get(this.targetUrl, options)
    .map(this._normalise)
    .toPromise();
  }

  private _normalise(events) {
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
   * download attachment by single event object
   * @param {[type]} event [description]
   */
  public downloadAttachment(event) {
    let url = event.fileUrl;
    // var blob = new Blob([data], { type: 'text/csv' });
    // var url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  /**
   * get event using observable
   * @param {integer} eventId single event id
   */
  public bookEvent(eventId) {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('event_id', eventId);
    return this.request.post(this.bookEventUrl, urlSearchParams);
  }
  public cancelEventBooking(eventId){
    return this.request.delete(this.bookEventUrl + '?event_id=' + eventId);
  }
  // get Events (Observable way for dashboard page forkjoin syntax only)
  public getUserEvents(activityIDs){
    return this.request.get(this.targetUrl+`?type=session&activity_id=[${activityIDs}]`);
  }
}
