import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
// services
import { CacheService } from '../shared/cache/cache.service';
@Injectable()
export class CharacterService {
  constructor(private request: RequestService,
              private cacheService: CacheService) {}
  // Get user character data
  getCharacters(){
    
  } 
}
