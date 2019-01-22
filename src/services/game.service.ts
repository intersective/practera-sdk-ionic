import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// Others
import { RequestService } from '../shared/request/request.service';
import * as _ from 'lodash';

@Injectable()
export class GameService {
  constructor(
    public request: RequestService
  ) {}
  /**
   * Get games
   */
  getGames() {
    return this.request.get('api/games');
  }
  /**
   * Get character
   * @param {string} gameId
   * @param {object} options
   */
  getCharacters(game_id, params = {}) {
    return this.request.get('api/characters', {
      search: Object.assign(params, { game_id })
    });
  }
  /**
   * Post character
   * @param {object} data
   */
  postCharacter(data) {
    return this.request.post('api/characters', data);
  }
  /**
   * Get ranking
   * @param {string} gameId
   * @param {string} characterId
   */
  getRanking(gameId, character_id) {
    let params:any = {
      'action': 'ranking',
      'period': 'monthly'
    };
    return Observable.forkJoin([
      this.getCharacters(gameId, params),
      this.getCharacters(gameId, Object.assign(params, { character_id }))
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
   * @param {object} options optional search query got GET request
   */
  getItems(options = {}) {
    options = _.merge({
      character_id: null,
      filter: 'all'
    }, options);
    return this.request.get('api/items.json', { search: options });
  }
  /**
   * Update items
   * @param {object} options
   */
  postItems(options: any = {
    "Character": {
      "id": null
    },
    "Item": {
      "id": null
    }
  }) {
    return this.request.post('api/items.json', options);
  }
}
