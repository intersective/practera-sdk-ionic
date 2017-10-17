import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

@Injectable()
export class GameService {
  constructor(
    private request: RequestService
  ) {}

  /**
   * Get games
   * @param {object} options
   */
  public getGames(options = {}) {
    return this.request.get('api/games', options);
  }

  /**
   * Get character
   * @param {string} gameId
   * @param {object} options
   */
  public getCharacters(gameId, options = {}) {
    options = _.merge({
      search: {
        game_id: gameId
      }
    }, options);
    return this.request.get('api/characters', options);
  }

  /**
   * Post character
   * @param {object} data
   */
  public postCharacter(data) {
    return this.request.post('api/characters', data, {
      'Content-Type': 'application/json'
    });
  }

  /**
   * Get ranking
   * @param {string} gameId
   * @param {string} characterId
   */
  public getRanking(gameId, characterId) {
    return Observable.forkJoin([
      this.getCharacters(gameId, {
        search: {
          action: 'ranking',
          period: 'monthly'
        }
      }),
      this.getCharacters(gameId, {
        search: {
          action: 'ranking',
          period: 'monthly',
          character_id: characterId
        }
      })
    ])
    .map((data: any[]) => {
      let characters = data[0] || [];
      let myCharacter = data[1].Characters || [];
      characters.MyCharacters = myCharacter
      return characters;
    });
  }

  /**
   * Get items
   * @param {object} options
   */
  public getItems(options?) {
    options = _.merge({
      character_id: null,
      filter: 'all'
    }, options);
    return this.request.get('api/items.json', {search: options});
  }

  /**
   * Update items
   * @param {object} options
   */
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
