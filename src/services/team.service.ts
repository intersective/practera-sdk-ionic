import { Injectable } from '@angular/core';
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class TeamService {
  constructor(
    private request: RequestService,
    private cacheService: CacheService
  ) {}

  public getTeam(options? : any) {
    return this.request.get('api/teams.json', options).toPromise();
  }
}
