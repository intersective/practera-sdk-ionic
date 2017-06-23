import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
@Injectable()
export class AchievementService {
  private userAchievementUrl = 'api/user_achievements.json';
  private totalAchievementUrl = 'api/achievements.json';
  constructor(private request: RequestService) {}
  // listAll()
  public getAchievements(params = {}) {
    return this.request.get(this.userAchievementUrl)
      // .map(response => response.json())
  }
  public getAllAchievements() {
    return this.request.get(this.totalAchievementUrl)
              //  .map(res => res.json())
  }
}
