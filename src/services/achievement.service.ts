import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
// services
import { CacheService } from '../shared/cache/cache.service';
@Injectable()
export class AchievementService {
  private target_id = this.cacheService.getLocalObject('program_id');
  private target_model = 'program';
  private getMaximumPointsUrl = `api/maximum_points.json?target_model=${this.target_model}&target_id=${this.target_id}`;
  private userAchievementUrl = 'api/user_achievements.json';
  private totalAchievementUrl = 'api/achievements.json';
  constructor(private request: RequestService,
              private cacheService: CacheService) {}
  // List Maximum Point Of Total Achievements
  public getMaxPoints(){
    return this.request.get(this.getMaximumPointsUrl);
  }

  // List User Achievements
  public getAchievements(params = {}) {
    return this.request.get(this.userAchievementUrl);
  }

  // List All Achievements
  public getAll() {
    return this.request.get(this.totalAchievementUrl);
  }

  /*
    turn:
    {
        "Achievement": {
            "id": 1,
            "name": "test",
            "description": "",
            "badge": "https://www.filepicker.io/api/file/test",
            "visibility": 1,
            "condition": "AND",
            "model": "Program",
            "model_id": 4,
            "is_default": false,
            "scope": "individual",
            "points": 100
        }
    }

    into:
    {
      "id": 1,
      "name": "test",
      "description": "",
      "badge": "https://www.filepicker.io/api/file/test",
      "visibility": 1,
      "condition": "AND",
      "model": "Program",
      "model_id": 1,
      "is_default": false,
      "scope": "individual",
      "points": 100
    }
   */
  public normalise(achievement) {
    return achievement.Achievement;
  }
}
