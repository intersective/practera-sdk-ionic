import { Injectable }    from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { RequestService } from '../shared/request/request.service';
import * as _ from 'lodash';
import { CacheService } from '../shared/cache/cache.service';
@Injectable()
export class MilestoneService {
  milestones: any = {};
  public appkey = this.request.getAppkey();
  public prefixUrl: any = this.request.getPrefixUrl();
  constructor(
    public cacheService: CacheService,
    public request: RequestService,
    public http: Http
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
