import { ModuleWithProviders, NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilepickerConfig, FilepickerService } from './filepicker.service';
import { FilePreviewDirective } from './file-preview.directive';

@NgModule({
  imports: [ CommonModule ],
  providers: [
    FilepickerService
  ],
  declarations: [
    FilePreviewDirective
  ],
  exports: [
    FilePreviewDirective,
    CommonModule,
  ]
})

export class FilepickerModule {
  constructor(@Optional() @SkipSelf() parentModule: FilepickerModule) {
    if (parentModule) {
      throw new Error('FilepickerModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: FilepickerConfig): ModuleWithProviders {
    return {
      ngModule: FilepickerModule,
      providers: [
        {provide: FilepickerConfig, useValue: config}
      ]
    }
  }
}
