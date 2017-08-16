import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

import * as _ from 'lodash';

@Injectable()
export class GameService {
  private gamesTarget = 'api/games';
  private charactersTarget = 'api/characters';

  constructor(
    private request: RequestService
  ) {}
  // get games
  public getGames(options = {}) {
    return this.request.get(this.gamesTarget, options);
  }

  public getCharacters(gameId, options = {}) {
    options = _.merge({
      search: {
        game_id: gameId
      }
    }, options);
    return this.request.get(this.charactersTarget, options);
  }

  public getRanking(gameId, characterId = null) {
    return this.getCharacters(gameId, {
      search: {
        action: 'ranking',
        character_id: characterId
      }
    });
  }
  // get game items 
  public getGameItems(character_id) {
    return this.request.get(`api/items.json?character_id=${character_id}&filter=items_all`);
  }
}
