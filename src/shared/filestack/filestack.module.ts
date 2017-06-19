import { ModuleWithProviders, NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilestackConfig, FilestackService } from './filestack.service';
import { FilestackPreviewDirective } from './file-preview.directive';

@NgModule({
  imports: [ CommonModule ],
  providers: [
    FilestackService
  ],
  declarations: [
    FilestackPreviewDirective
  ],
  exports: [
    FilestackPreviewDirective,
    CommonModule,
  ]
})

export class FilestackModule {
  constructor(@Optional() @SkipSelf() parentModule: FilestackModule) {
    if (parentModule) {
      throw new Error('FilestackModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: FilestackConfig): ModuleWithProviders {
    return {
      ngModule: FilestackModule,
      providers: [
        {provide: FilestackConfig, useValue: config}
      ]
    }
  }
}
