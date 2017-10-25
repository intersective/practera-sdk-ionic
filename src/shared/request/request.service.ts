import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { CacheService } from '../../shared/cache/cache.service';

// Definition configure for API request
// This ONLY definition of class, any changed of value will no effect.
// Please configuring on `configs/config.ts`.
export class RequestServiceConfig {
  appKey = '';
  prefixUrl = 'http://local.practera.com/'
}

@Injectable()
export class RequestService {
  private appkey: string;
  private prefixUrl: string;

  private apikey: string;
  private timelineID: number;

  constructor (
    @Optional() config: RequestServiceConfig,
    private http: HttpClient,
    private cacheService: CacheService
  ) {
    // Inject appKey and prefixUrl when RequestServiceConfig loaded
    if (config) {
      this.appkey = config.appKey;
      this.prefixUrl = config.prefixUrl;
    }
  }

  /**
   * Return current prefixUrl
   * @param {String} prefixUrl
   */
  public getPrefixUrl(){
    return this.prefixUrl;
  }

  /**
   * Return current appKey
   * @param {String} appKey
   */
  public getAppkey(){
    return this.appkey;
  }

  /**
   * Error handle for API response
   * @param {Error} error
   */
  private handleError (error) {
    let errorFrom = {
        api: 'SERVER_ERROR',
      },
      currentError: any = error;
    console.log(currentError);
    if (typeof error !== 'object') {
      throw 'Unable to process API respond!';
    }
    if (error.status === 0) { // client unrecoverable error encountered
      currentError.frontendCode = errorFrom.api;
    } else {
      let errorBody = error.json();
      currentError.frontendCode = errorBody.data || errorBody.error;
    }
    return Observable.throw(currentError);
  }

  // Inject required fields to header of API request
  appendHeader(customHeader: any = {
    'contentType': 'application/json',
    'apikey': null
  }): HttpHeaders {
    let headers = new HttpHeaders();
    headers.set('Content-Type', customHeader.contentType);

    // Inject apiKey from cached
    let apiKey = this.cacheService.getCached('apikey') ||
      this.cacheService.getLocalObject('apikey');
    if (!_.isEmpty(apiKey)) {
      headers.set('apikey', apiKey);
    }

    // Inject timelineID from cached
    let timelineId = this.cacheService.getCached('timelineID') ||
      this.cacheService.getLocalObject('timelineID');
    if (timelineId) {
      headers.set('timelineID', timelineId);
    }

    // Inject appKey from config
    if (!_.isUndefined(this.appkey)) {
      headers.set('appkey', this.appkey);
    }
    return headers;
  }

  // Set API request options
  setOptions(options?: {
    headers?: HttpHeaders;
    observe?: "body";
    params?: HttpParams;
    reportProgress?: boolean;
    responseType: "arraybuffer";
    withCredentials?: boolean;
    search?: string;
  }):{
    headers: HttpHeaders;
    params?: HttpParams;
  } {
    let headers = this.appendHeader();
    let timelineId = this.cacheService.getLocal('timelineID');

    let params = new HttpParams();
    if (timelineId) {
      params.set('timelineID', timelineId);
    }

    if (options && options.search) {
      _.each(options.search, (value, key) => {
        params.set(key, value);
      });
    }

    return {
      headers,
      params
    };
  }

  /**
   * Send GET request to server
   * @param {String} endPoint
   * @param {Object} options
   */
  get(endPoint: string = '', options?: any) {
    return this.http.get(this.prefixUrl + endPoint, this.setOptions(options))
      .catch(this.handleError);
  }

  /**
   * Send POST request to server
   * @param {String} endPoint
   * @param {Object} data
   * @param {Object} header
   */
  post(endPoint: string, data: any, header?: any) {
    let headers = this.appendHeader();

    // @TODO: make sure if Content-Type is optional
    // if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/x-www-form-urlencoded')
    // }

    return this.http.post(this.prefixUrl + endPoint, data, {
      headers: headers
    }).catch(this.handleError);
  }

  /**
   * Send DELETE request to server
   * @param {String} endPoint
   * @param {Object} header
   */
  delete(endPoint: string, header?:Object) {
    return this.http.delete(this.prefixUrl + endPoint, {
      headers: this.appendHeader(header)
    })
      .catch(this.handleError);
  }

}
