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
// <<<<<<< HEAD
//   getMilestones(options?) {
//     let params: URLSearchParams = new URLSearchParams();
//     if (options && options.search) {
//       // @TODO: Move to helper function
//       _.forEach(options.search, (value, key) => {
//         params.set(key, value);
//       });
//     }
//     let timelineId = this.cacheService.getLocal('timeline_id');
//     if (timelineId) {
//       params.set('timelineId', timelineId);
//     }
//     return this.request.get('api/milestones.json', {search: params});
//   }
// =======
  getList() {
    let timeline_id = this.cacheService.getLocal('timeline_id');

    return this.request.get('api/milestones.json', {
      search: { timeline_id }
    });
  }

  getMilestones(){
    return this.request.get('api/milestones.json');
  }
// >>>>>>> bugfix/ISDK-86/refactor-login-registration-reset-forgot-password
}
