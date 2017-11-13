import { Component } from '@angular/core';

// services
import { CacheService } from '../../../shared/cache/cache.service';

@Component({
  selector: 'leaderboard-settings-page',
  templateUrl: 'leaderboard-settings.html'
})
export class LeaderboardSettingsPage {
  isHide: boolean = false;
  useremail: string;
  username: string;

  constructor(
    public cacheService: CacheService
  ) {
    this.useremail = JSON.stringify(this.cacheService.getLocal('email'));
    this.username = JSON.stringify(this.cacheService.getLocal('name'));
  }
}
