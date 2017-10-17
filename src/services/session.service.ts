import { Injectable }    from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { RequestService } from '../shared/request/request.service';

import * as moment from 'moment';

@Injectable()
export class SessionService {
  public targetUrl = 'api/sessions.json';

  constructor(public request: RequestService) {}

  public getSessions() {

    // let params: URLSearchParams = new URLSearchParams();
    // params.set('activity_id', params.activity_id);

    return this.request.get(this.targetUrl)
      .map(response => response.json())
      .map(this._normalise)
      .toPromise();
  }

  public _normalise(session) {
    session.start = moment.utc(session.start);
    session.end = moment.utc(session.end);
    session.isExpired = moment().isAfter(session.end);
    session.isFull = false;

    if (session.remaining_capacity === 0) {
        session.isFull = true;
    }
    return session;
  }

}
