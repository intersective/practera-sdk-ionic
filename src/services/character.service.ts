import { Injectable }    from '@angular/core';

// services
import { RequestService } from '../shared/request/request.service';
import { CacheService } from '../shared/cache/cache.service';
@Injectable()
export class CharacterService {
  public charactersAPIEndpoint = `api/characters.json`;
  public game_id = this.cache.getLocal('game_id');
  
  constructor(
    private cache: CacheService,
    private request: RequestService,
  ) {
    console.log("game_id: ", this.game_id);
  }

  getCharacter(){
    return this.request.get(this.charactersAPIEndpoint + "?game_id=" + this.game_id);
  }
}
