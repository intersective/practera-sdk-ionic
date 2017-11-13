import {
  ModuleWithProviders,
  NgModule,
  SkipSelf,
  Optional
} from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestModule } from '../request/request.module';
import { CommonModule } from '@angular/common';
import { RequestServiceConfig, RequestService } from '../request/request.service';
import { RankingBadgesPage } from './components/view/ranking-badges';
import { RankingDetailsPage } from './components/view/ranking-details.page';
import { RankingsPage } from './components/list/rankings.page';

import { CacheService } from '../cache/cache.service';
import { GameService } from '../../services/game.service';
import { TranslationModule } from '../translation/translation.module';
import { TranslationService } from '../translation/translation.service';
import { AchievementService } from '../../services/achievement.service';

@NgModule({
  imports: [
    RequestModule,
    CommonModule,
    IonicModule,
    TranslationModule
  ],
  providers: [
    RequestService,
    CacheService,
    GameService,
    TranslationService,
    AchievementService,
  ],
  declarations: [
    RankingBadgesPage,
    RankingDetailsPage,
    RankingsPage,
  ],
  exports: [
    RankingBadgesPage,
    RankingDetailsPage,
    RankingsPage,
    CommonModule,
    IonicModule,
    RequestModule,
    TranslationModule
  ]
})

export class RankingModule {
  constructor(@Optional() @SkipSelf() parentModule: RankingModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  /*static forRoot(config: RequestServiceConfig): ModuleWithProviders {
    return {
      ngModule: RequestModule,
      providers: [
        {
          provide: RequestServiceConfig, useValue: config
        }
      ]
    }
  }*/
}
