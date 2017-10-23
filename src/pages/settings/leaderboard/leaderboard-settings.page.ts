import { Component } from '@angular/core';

// services
import { CacheService } from '../../../shared/cache/cache.service';

@Component({
  selector: 'leaderboard-settings-page',
  templateUrl: 'leaderboard-settings.html'
})
export class LeaderboardSettingsPage {
  isHide: boolean = false;
  useremail: string = this.cacheService.getLocalObject('email') || '';
  username: string = this.cacheService.getLocalObject('name') || '';

  constructor(
    public cacheService: CacheService
  ) {}
}
