import { Injectable }    from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';

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
    public http: Http,
    public request: RequestService
  ) {}

  getList(options?) {
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

  getMilestones(){
    let headers = new Headers();
    headers.append('appkey', this.appkey);
    headers.append('apikey', this.cacheService.getLocalObject('apikey'));
    headers.append('timelineID', this.cacheService.getLocalObject('timelineID'));
    console.log('TimelineID: '+ this.cacheService.getLocalObject('timelineID'));
    return this.http.get(this.prefixUrl+'api/milestones.json', { headers: headers })
               .map(res => res.json());
  }
}
