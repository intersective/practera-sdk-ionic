import { Injectable }    from '@angular/core';
import { URLSearchParams }    from '@angular/http';

import * as moment from 'moment';
import * as _ from 'lodash';

import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class ActivityService {
  constructor(
    private request: RequestService,
    private cacheService: CacheService
  ) {}

  public getList() {
    return this.request.get('api/activities.json', {
      search: {
        milestone_id: this.cacheService.getLocal('milestone_id')
      }
    })
    .toPromise();
  }

  public getLevels = (options?: any) => {
    let params: URLSearchParams = new URLSearchParams();
    if (options.search) {
      _.forEach(options.search, (value, key) => {
        params.set(key, value);
      });
      options.search = params;
    }

    return this.cacheService.read()
      .then((data: any) => {
        if (!options.search.timeline_id && data.user.timeline_id) {
          params.set('timeline_id', data.user.timeline_id);
          options.search = params;
        }

        if (!options.search.project_id && data.user.project_id) {
          params.set('project_id', data.user.project_id);
          options.search = params;
        }

        return this.request.get('api/activities.json', options)
          .toPromise();
      });
  }

  normalise(activity, index) {
    // session
    activity.enabledRSVP = true;

    // survey
    activity.due = false;
    activity.isRunning = false;
    activity.isBookable = false;
    activity.is_locked = activity.Activity.is_locked;
    activity.name = activity.Activity.name;
    activity.id = activity.Activity.id;
    activity.hasSession = false;
    activity.description = activity.Activity.description || 'No description available.';

    // pre-process response data
    activity.start = moment.utc(activity.Activity.start);
    activity.deadline = moment.utc(activity.Activity.deadline);
    activity.end = moment.utc(activity.Activity.end);

    // if sorting is not available, use index instead
    activity.order = activity.Activity.order || index;
    return activity;
  }
}
