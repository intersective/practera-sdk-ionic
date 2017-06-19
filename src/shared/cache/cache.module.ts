import { NgModule } from '@angular/core';
import { CacheService } from './cache.service';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  imports: [
    IonicStorageModule.forRoot({
      name: '__app-vault',
      driverOrder: ['localstorage']
    })
  ],
  providers: [ CacheService ],
})
export class CacheModule {

  constructor() {}
}
