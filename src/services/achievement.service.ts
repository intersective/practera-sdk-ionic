import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class AchievementService {
  private targetUrl = 'api/user_achievements.json';

  constructor(private request: RequestService) {}

  // listAll()
  public getAchievements(params = {}) {
    return this.request.get(this.targetUrl)
      .map(response => response.json());
  }

}
