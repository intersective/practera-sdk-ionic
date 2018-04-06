import { ModuleWithProviders, NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PiwikService } from './piwik.service';
import { PiwikConfig } from './piwik.config';

@NgModule({
  imports: [ CommonModule ],
  providers: [
    PiwikService,
  ],
  declarations: [
  ],
  exports: [
    CommonModule,
  ]
})

export class PiwikModule {
  constructor(@Optional() @SkipSelf() parentModule: PiwikModule) {
    if (parentModule) {
      throw new Error('PiwikModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: PiwikConfig): ModuleWithProviders {
    return {
      ngModule: PiwikModule,
      providers: [
        {provide: PiwikConfig, useValue: config}
      ]
    }
  }
}
