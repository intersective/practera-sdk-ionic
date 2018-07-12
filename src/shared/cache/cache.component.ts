import { Component } from '@angular/core';

import { CacheService } from './cache.service';

@Component({
  selector: 'app-cache',
  template: ``
})
export class CacheComponent {

  constructor(
    public cacheService: CacheService
  ) {}

  setLocal(key: string, value: string | Boolean) {
    return this.cacheService.setLocal(key, value);
  }

  getLocal(key: string) {
    return this.cacheService.getLocal(key);
  }
}
