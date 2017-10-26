import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Others
import { RequestService } from '../shared/request/request.service';
import { CacheService } from '../shared/cache/cache.service';
import * as _ from 'lodash';

@Injectable()
export class MilestoneService {
  milestones: any = {};

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
      params = params.set('timelineId', JSON.stringify(timelineId));
    }

    return this.request.get('api/milestones.json', { params });
  }

  getMilestones(){
    return this.request.get('api/milestones.json');
  }
}
