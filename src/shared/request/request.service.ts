import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
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
  private handleError(error) {
    let errorFrom = { api: 'SERVER_ERROR' },
        currentError: any = error;

    if (typeof error !== 'object') {
      throw 'Unable to process API respond!';
    }

    let errorBody = error.body || error.error;
    if (typeof errorBody == 'string') {
      errorBody = JSON.parse(errorBody);
    }

    /* @TODO: error tracking - logging feature coming soon
    if (error.status === 0) { // client unrecoverable error encountered
      currentError.frontendCode = errorFrom.api;
    } else {
      currentError.frontendCode = errorBody.data || errorBody.error;
    }
    return Observable.throw(currentError);
    */

    return Observable.throw(errorBody);
  }

  // Inject required fields to header of API request
  appendHeader(customHeader: any = {
    'contentType': 'application/json',
    'apikey': null
  }): HttpHeaders {
    let result:any;
    let headers = new HttpHeaders();
    result = headers.set('Content-Type', customHeader.contentType);
    // Inject apiKey from cached
    let apiKey = this.cacheService.getCached('apikey') ||
      this.cacheService.getLocal('apikey');
    if (!_.isEmpty(apiKey)) {
      result = result.set('apikey', apiKey.toString());
    }
    // Inject timelineID from cached
    let timelineId = this.cacheService.getCached('timelineID') ||
      this.cacheService.getLocal('timelineID');
    if (timelineId) {
      result = result.set('timelineID', timelineId.toString());
    }
    return result;
  }
  // Set API request options
  setOptions(options?): {
    headers?: HttpHeaders;
    observe?: "body";
    params?: HttpParams;
    reportProgress?: boolean;
    withCredentials?: boolean;
    search?: string;
  } {
    let headers = this.appendHeader();
    // setup http params
    let params = (options && options.params) ? options.params : new HttpParams();
    if (options && options.search) {
      _.each(options.search, (value, key) => {
        params = params.set(key, value.toString());
      });
    }
    let timelineId = this.cacheService.getLocal('timelineID');
    if (timelineId) {
      params = params.set('timelineID', timelineId);
    }
    return { headers, params };
  }
  /**
   * Send GET request to server
   * @param {String} endPoint
   * @param {Object} options
   */
  get(endPoint: string = '', options?: any) {
    let searchQuery = (options && options.search) ? options.search : null;
    options = this.setOptions(options);
    options.observe = 'body';
    options.responseType = 'json';
    options.search = searchQuery;

    return this.http.get(this.prefixUrl + endPoint, options)
      .map(this.extractData)
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
    headers = headers.delete('Content-Type');
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.prefixUrl + endPoint, data, { headers })
      .map(this.extractData)
      .catch(this.handleError);
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
      .map(this.extractData)
      .catch(this.handleError);
  }
  // Extract response data and convert it to JSON
  extractData(res) {
    return res.data || res;
  }
}
