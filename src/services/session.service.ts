import { Injectable }    from '@angular/core';
import { URLSearchParams } from '@angular/http';

// Others
import { RequestService } from '../shared/request/request.service';
import * as moment from 'moment';

@Injectable()
export class SessionService {
  targetUrl = 'api/sessions.json';

  constructor(
    public request: RequestService
  ) {}

  getSessions() {
    return this.request.get(this.targetUrl)
      .map(response => response.json())
      .map(this._normalise)
      .toPromise();
  }

  _normalise(session) {
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
