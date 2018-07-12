import { Injectable } from '@angular/core';

// Others
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class TeamService {
  constructor(
    public cacheService: CacheService,
    public request: RequestService
  ) {}

  getTeam() {
    return this.request.get('api/teams.json').toPromise();
  }
}
