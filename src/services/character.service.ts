import { Injectable }    from '@angular/core';

// services
import { RequestService } from '../shared/request/request.service';
import { CacheService } from '../shared/cache/cache.service';
@Injectable()
export class CharacterService {
  public charactersAPIEndpoint: any = 'api/characters.json';
  public game_id: any = this.cache.getLocal('game_id');
  constructor(
    private cache: CacheService,
    private request: RequestService,
  ) {
    this.game_id = this.cache.getLocal('game_id');
    console.log("game_id: ", this.game_id);
  }
  getCharacter(){
    return this.request.get(this.charactersAPIEndpoint + `?game_id=${this.game_id}`);
  }
}
