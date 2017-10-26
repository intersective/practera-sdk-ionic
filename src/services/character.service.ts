import { Injectable }    from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

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
    let params = new HttpParams();
    let game_id = this.cache.getLocal('game_id');

    if (game_id) {
      params = params.set('game_id', game_id.toString());
    }

    return this.request.get(this.charactersAPIEndpoint, { params });
  }

  /**
   * Post character
   * @param {object} data
   */
  postCharacter(data) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    return this.request.post(this.charactersAPIEndpoint, data, { headers });
  }
}
