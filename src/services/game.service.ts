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
  getCharacters(gameId, params?: HttpParams) {
    params = params.set('game_id', gameId.toString())
    return this.request.get('api/characters', { params });
  }

  /**
   * Post character
   * @param {object} data
   */
  postCharacter(data) {
    return this.request.post('api/characters', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  /**
   * Get ranking
   * @param {string} gameId
   * @param {string} characterId
   */
  getRanking(gameId, characterId) {
    let params = new HttpParams();
    params = params.set('action', 'ranking').set('period', 'monthly');

    return Observable.forkJoin([
      this.getCharacters(gameId, params),
      this.getCharacters(gameId, params.set('character_id', characterId.toString()))
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
  getItems(options?) {
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
  postItems(options: any = {
    "Character": {
      "id": null
    },
    "Item": {
      "id": null
    }
  }) {
    return this.request.post('api/items.json', options, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
