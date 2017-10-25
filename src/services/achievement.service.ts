import { Injectable } from '@angular/core';

// Services
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class AchievementService {
  target_model = 'program';
  target_id = this.cacheService.getLocalObject('program_id');
  getMaximumPointsUrl = `api/maximum_points.json?target_model=${this.target_model}&target_id=${this.target_id}`;
  totalAchievementUrl = 'api/achievements.json';
  userAchievementUrl = 'api/user_achievements.json';

  constructor(
    public cacheService: CacheService,
    public request: RequestService
  ) {}

  // List Maximum Point Of Total Achievements
  getMaxPoints(){
    return this.request.get(this.getMaximumPointsUrl);
  }

  // List User Achievements
  getAchievements(params = {}) {
    return this.request.get(this.userAchievementUrl);
  }

  // List All Achievements
  getAll() {
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
   normalise(achievement) {
    return achievement.Achievement;
  }
}
