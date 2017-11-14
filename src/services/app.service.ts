// This file is internal API call use to integrate similar API calls based on DRY rule
import { Injectable }    from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { GameService } from './game.service';
import { MilestoneService } from './milestone.service';

@Injectable()
export class AppService {
  constructor(public auth: AuthService,
    public game: GameService, 
    public milestone: MilestoneService){}
  
  // get character data which involves with game data, user data and milestone data 
  getCharacter(){
    return Observable.forkJoin([this.game.getGames(), this.auth.getUser(), this.milestone.getMilestones()]);
  }
}