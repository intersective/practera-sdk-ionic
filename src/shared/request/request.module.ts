import {
  ModuleWithProviders,
  NgModule,
  SkipSelf,
  Optional
} from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import '../rxjs-operators';
import { RequestServiceConfig, RequestService } from './request.service';
import { AppInterceptor } from './app.interceptor';

@NgModule({
  imports: [HttpClientModule, CommonModule, /* spare a space for appcache module*/],
  providers: [
    RequestService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    }
    // { provide: RequestOptions, useClass: CustomRequestOption }
  ]
})

export class RequestModule {
  constructor(@Optional() @SkipSelf() parentModule: RequestModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(config: RequestServiceConfig): ModuleWithProviders {
    return {
      ngModule: RequestModule,
      providers: [
        {
          provide: RequestServiceConfig, useValue: config
        }
      ]
    }
  }
}
