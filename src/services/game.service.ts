import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
import { URLSearchParams } from '@angular/http';

import * as _ from 'lodash';

@Injectable()
export class GameService {
  constructor(
    private request: RequestService
  ) {}
  // get games
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

  public getItems(options?) {
    options = _.merge({
      character_id: null,
      filter: 'all'
    }, options);
    return this.request.get('api/items.json', {search: options});
  }

  public postItems(options: any = {
    "Character": {
      "id": null
    },
    "Item": {
      "id": null
    }
  }) {
    return this.request.post('api/items.json', options, {'Content-Type': 'application/json'});
  }
}
