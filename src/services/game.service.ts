import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

import * as _ from 'lodash';

@Injectable()
export class GameService {
  constructor(
    private request: RequestService
  ) {}

  public getGames(options = {}) {
    return this.request.get('api/games', options);
  }

  public getCharacters(gameId, options = {}) {
    options = _.merge({
      search: {
        game_id: gameId
      }
    }, options);
    return this.request.get('api/characters', options);
  }

  public getRanking(gameId, characterId = null) {
    return this.getCharacters(gameId, {
      search: {
        action: 'ranking',
        character_id: characterId
      }
    });
  }

  public getItems(characterId, filters?) {
    return this.request.get('api/items', filters);
  }
}
