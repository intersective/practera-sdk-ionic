import { Injectable }    from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams }    from '@angular/http';
import * as moment from 'moment';
import * as _ from 'lodash';
// services
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class ActivityService {
  public milestoneID = this.cacheService.getLocalObject('milestone_id');
  public activityAPIEndPoint = 'api/activities.json';
  constructor(
    private request: RequestService,
    private cacheService: CacheService,
    private http: Http
  ) {}
  public getList() {
    return this.request.get(this.activityAPIEndPoint, {
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
        return this.request.get(this.activityAPIEndPoint, options)
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
  // another way of get activity data list
  public getActivities(){
    return this.request.get(this.activityAPIEndPoint);
  }
}
