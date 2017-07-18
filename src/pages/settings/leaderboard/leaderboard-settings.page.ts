import { Component } from '@angular/core';
// services
import { CacheService } from '../../../shared/cache/cache.service';
@Component({
  selector: 'leaderboard-settings-page',
  templateUrl: 'leaderboard-settings.html'
})
export class LeaderboardSettingsPage {
  public username: string = this.cacheService.getLocalObject('name') || '';
  public useremail: string = this.cacheService.getLocalObject('email') || '';
  public isHide: boolean = false;
  constructor(private cacheService: CacheService){

  }
}