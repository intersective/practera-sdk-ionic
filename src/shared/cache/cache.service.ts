import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Cache } from '../app/cache';

import * as _ from 'lodash';

@Injectable()
export class CacheService {

  public localStorage: any;
  public bufferZone = {}; // temporary cached storage in service

  constructor(
    public storage: Storage
  ) {
    storage.ready().then(() => {
      console.log('Storage loaded.');
      this.read('*', true).then(content => this.bufferZone = content);
    });

    if (!localStorage) {
      throw new Error('Current browser does not support Local Storage');
    }
    this.localStorage = localStorage;
  }

  private key = '_app_cache';

  set(key, value) {
    return this.storage.set(key, value);
  }

  /**
   * DEPRECATED
   * get memory cached values by key
   * @param {object||string}
   */
  getCached(key) {
    if (this.bufferZone) {
      return this.bufferZone[key] || null;
    }
    return null;
  }

  /**
   * DEPRECATED
   * Write data into local storage
   * @param {string} path - path to store data
   * @param {any} content - data to store
   * @return {promise} <data had store>
   */
  write(path: string, content: any) {
    this.bufferZone = _.set(this.bufferZone, path, content);

    return new Promise((resolve, reject) => {
      this.storage.set(this.key, this.bufferZone)
        .then(resolve, reject);
    });
  }

  /**
   * DEPRECATED
   * Read data into local storage
   * @param {string} path - path to read data
   * @return {promise} <data store>
   */
  read(path: string = '*', strict: boolean = false) {
    if (!strict) {
      return new Promise((resolve, reject) => {
        if (!this.bufferZone && path !== '*') {
          return resolve(null);
        }

        if (path === '*') {
          return resolve(this.bufferZone);
        }

        return resolve(_.get(this.bufferZone, path));
      });
    } else {
      return new Promise((resolve, reject) => {
        this.storage.get(this.key)
        .then((data: Cache) => {
          if (!data && path !== '*') {
            return resolve(null);
          }

          if (path === '*') {
            return resolve(data);
          }

          return resolve(_.get(data, path));
        }, reject);
      });
    }
  }

  /**
   * DEPRECATED
   */
  public clear(): any {
    return this.storage.clear();
  }

  // public remove(cb): any;
  // public length(cb): any;
  // public keys(cb): any;
  // public forEach(cb): any;

  // pure localStorage implementation
  public setLocal(key: string, value: string | boolean | number | object): void {
    this.localStorage[key] = JSON.stringify(value);
  }

  public getLocal(key: string): object {
    if (!this.localStorage[key]) {
      return null;
    }
    return JSON.parse(this.localStorage[key]);
  }

  public removeLocal(key: string): any {
    this.localStorage.removeItem(key);
  }

  public clearLocal(cb): any {
    return cb(this.localStorage.clear());
  }
}
