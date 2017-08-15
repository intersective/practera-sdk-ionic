import { Injectable }    from '@angular/core';

// services
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class CharacterService {
  public charactersAPIEndpoint = `api/characters.json`;
  constructor(
    private request: RequestService
  ) {}

  getCharacter() {
    return this.request.get(this.charactersAPIEndpoint);
  }

  postCharacter(data) {
    return this.request.post(this.charactersAPIEndpoint, data);
  }
}
