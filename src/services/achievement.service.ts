import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
// services
import { CacheService } from '../shared/cache/cache.service';
@Injectable()
export class AchievementService {
  private target_id = this.cacheService.getLocalObject('program_id');
  private target_model = 'program';

  constructor(
    private request: RequestService,
    private cacheService: CacheService
  ) {}

  // List Maximum Point Of Total Achievements
  public getMaxPoints(){
    return this.request.get('api/maximum_points.json?target_model=' + this.target_model + '&target_id=' + this.target_id)
  }

  // List User Achievements
  public getAchievements(params = {}) {
    return this.request.get('api/user_achievements.json')
  }

  // List All Achievements
  public getAll() {
    return this.request.get('api/achievements.json')
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
