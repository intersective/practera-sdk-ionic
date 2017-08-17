import { Injectable }    from '@angular/core';
import { URLSearchParams } from '@angular/http';
import * as moment from 'moment';
import * as _ from 'lodash';
// services
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class ActivityService {
  private cachedActivites = {};

  public milestoneID = this.cacheService.getLocalObject('milestone_id');
  constructor(
    private request: RequestService,
    private cacheService: CacheService,
  ) {}

  public getList(options?) {
    let mid = this.cacheService.getLocal('milestone_id');

    options = options || {
      search: {
        milestone_id: this.cacheService.getLocal('milestone_id')
      }
    };

    if (!this.cachedActivites[mid]) {
      this.cachedActivites[mid] = this.request.get('api/activities.json', options);
      return this.request.get('api/activities.json', options);
    }

    return this.cachedActivites[mid];
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
        return this.getList(options).toPromise();
      });
  }

  /*
   // commented out - seems not using in any part of the code
   // it was built for currentActivities component in HomePage,
   // no longer using it now

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
  }*/


  /**
   * normalise activities
   */
  public normaliseActivities(activities): Array<any> {
    let result = [];

    activities.forEach((act, index) => {
      result[index] = this.normaliseActivity(act);
    });
    return result;
  }

  /**
   * normalise single activity object
   */
  public normaliseActivity(activity) {
    return _.merge(activity.Activity, {
      activity: activity.Activity,
      sequences: activity.ActivitySequence,
      Activity: activity.Activity,
      ActivitySequence: activity.ActivitySequence,
      References: activity.References
    });
  }

  /*
    turns:
    [
      {
        "context_id": 25,
        "Assessment": {
          "id": 19,
          "name": "Check-In Workshop 1"
        }
      },
      {
        "context_id": 26,
        "Assessment": {
          "id": 20,
          "name": "Check-In Workshop 2"
        }
      },
      ...
    ]

    into:
    {
      19: 25,
      20: 26
    }
   */
  public rebuildReferences(references) {
    let result = {};
    references.forEach(ref => {
      result[ref.Assessment.id] = ref.context_id;
    });
    return result;
  }
}
