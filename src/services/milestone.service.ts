import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Others
import { RequestService } from '../shared/request/request.service';
import { CacheService } from '../shared/cache/cache.service';
import * as _ from 'lodash';

@Injectable()
export class MilestoneService {
  appkey = this.request.getAppkey();
  milestones: any = {};
  prefixUrl: any = this.request.getPrefixUrl();

  constructor(
    public cacheService: CacheService,
    public request: RequestService
  ) {}

  getList(options?) {
    let params = new HttpParams();

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

    return this.request.get('api/milestones.json', {params});
  }

  getMilestones(){
    let headers = new HttpHeaders();
    headers.append('appkey', this.appkey);
    headers.append('apikey', this.cacheService.getLocalObject('apikey'));
    headers.append('timelineID', this.cacheService.getLocalObject('timelineID'));

    return this.request.get(this.prefixUrl+'api/milestones.json', { headers });
  }
}
