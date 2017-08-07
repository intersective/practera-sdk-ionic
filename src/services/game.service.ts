import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class GameService {
  constructor(private request: RequestService) {}

  public getAchievements(options) {
    return this.request.get('api/achievements', options);
  }
}
