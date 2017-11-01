import { Injectable }    from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
// Others
import { RequestService } from '../shared/request/request.service';
import { CacheService } from '../shared/cache/cache.service';
import * as _ from 'lodash';

@Injectable()
export class MilestoneService {
  appkey: any = this.request.getAppkey();
  milestones: any = {};
  prefixUrl: any = this.request.getPrefixUrl();
  constructor(
    public cacheService: CacheService,
    public http: Http,
    public request: RequestService
  ) {}
  getMilestones(options?) {
    let params: URLSearchParams = new URLSearchParams();
    if (options && options.search) {
      // @TODO: Move to helper function
      _.forEach(options.search, (value, key) => {
        params.set(key, value);
      });
    }
    let timelineId = this.cacheService.getLocal('timeline_id');
    if (timelineId) {
      params.set('timelineId', timelineId);
    }
    return this.request.get('api/milestones.json', {search: params});
  }
}
