import { Injectable, Optional } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestServiceConfig } from './request.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  currenConfig: any;
  constructor(@Optional() config: RequestServiceConfig) {
    this.currenConfig = config;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const appRequest = req.clone({
      headers: req.headers.set('appkey', this.currenConfig.appKey)
    });

    return next.handle(appRequest);
  }
}
