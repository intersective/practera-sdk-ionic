import { Injectable, Optional } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs, URLSearchParams } from '@angular/http';
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
    private http: Http,
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
      currentError: any = error.json();
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
  appendHeader(customHeader: Object = {
    'Content-Type': 'application/json',
    'apikey': null
  }) {
    let headers = new Headers(customHeader);

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

    // Inject milestoneID from cached
    let milestoneId = this.cacheService.getCached('milestone_id') ||
      this.cacheService.getLocalObject('milestone_id');
    if (milestoneId) {
      headers.set('milestoneID', milestoneId);
    }

    // Inject appKey from config
    if (!_.isUndefined(this.appkey)) {
      headers.set('appkey', this.appkey);
    }
    return headers;
  }

  // Set API request options
  setOptions(options) {
    let result = new RequestOptions({ headers: this.appendHeader() });
    let timelineId = this.cacheService.getLocal('timelineID');

    let params = new URLSearchParams();
    if (timelineId) {
      params.set('timelineID', timelineId);
    }

    if (options && options.search) {
      _.each(options.search, (value, key) => {
        params.set(key, value);
      });
    }
    result.search = params;

    return result;
  }

  /**
   * Send GET request to server
   * @param {String} endPoint
   * @param {Object} options
   */
  get(endPoint: string = '', options?: any) {
    let opt = this.setOptions(options);

    return this.http.get(this.prefixUrl + endPoint, opt)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Send POST request to server
   * @param {String} endPoint
   * @param {Object} data
   * @param {Object} header
   */
  post(endPoint: string, data: any, header = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }) {
    let options = new RequestOptions({ headers: this.appendHeader(header) });
    return this.http.post(this.prefixUrl + endPoint, data, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /**
   * Send DELETE request to server
   * @param {String} endPoint
   * @param {Object} header
   */
  delete(endPoint: string, header?:Object) {
    let options = new RequestOptions({ headers: this.appendHeader(header) });
    return this.http.delete(this.prefixUrl + endPoint, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // Extract response data and convert it to JSON
  extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }
}
