import { Injectable }    from '@angular/core';

// services
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class CharacterService {
  charactersAPIEndpoint: any = 'api/characters.json';

  constructor(
    public cache: CacheService,
    public request: RequestService
  ) {}

  /**
   * Get character
   */
  getCharacter() {
    return this.request.get(this.charactersAPIEndpoint, {
      search: {
        game_id: this.cache.getLocalObject('game_id')
      }
    });
  }

  /**
   * Post character
   * @param {object} data
   */
  postCharacter(data) {
    return this.request.post(this.charactersAPIEndpoint, data, {
      'Content-Type': 'application/json'
    });
  }
}
