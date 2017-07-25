import { Injectable }    from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import * as _ from 'lodash';
// services
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class CharactersService {
  public charactersAPIEndpoint = `api/characters.json`;
  constructor(private request: RequestService){

  }
  getCharacter(){
    return this.request.get(this.charactersAPIEndpoint);
  }
}