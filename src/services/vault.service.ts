// @DEPRECATED
import { Injectable }    from '@angular/core';
import { Storage } from '@ionic/storage';

import { AppStorage } from '../app/app.storage';
import { UserStorage } from '../app/user.storage';

import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class VaultService {

  constructor(
    public storage: Storage
  ) {
    storage.ready().then(() => {
      console.log('Storage loaded.')
    });
  }

  public read(key) {
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then((data) => {
          if (!data) {
            resolve(null);
          }

          if (data.exp && !moment().isBefore(data.exp)) {
            resolve(null);
          }

          resolve(data.content);
        })
        .catch(err => reject(err))
    });
  }

  public write(key, content = {}, cacheSeconds?) {
    let data = {
      exp: null,
      content: content
    }

    if (cacheSeconds) {
      data.exp = moment().add(cacheSeconds, 'seconds');
    }

    return this.storage.set(key, data);
  }

  public app(key, content?) {
    return new Promise((resolve, reject) => {
      this.read('app')
      .then((data: AppStorage) => {
        if (content) {
          let periodContent: AppStorage = data;
          let mergedContent: AppStorage = _.merge(periodContent, { [key]: content });

          this.write('app', mergedContent).then(resolve, reject);
        } else {
          if (!data) {
            return resolve(null);
          }
          return resolve(_.get(data, key));
        }
      }, reject);
    });
  }

  public user(key, content?) {
    return new Promise((resolve, reject) => {
      this.read('user')
      .then((data: UserStorage) => {
        if (content) {
          let periodContent: UserStorage = data;
          let mergedContent: UserStorage = _.merge(periodContent, { [key]: content });

          this.write('user', mergedContent).then(resolve, reject);
        } else {
          if (!data) {
            return resolve(null);
          }
          return resolve(_.get(data, key));
        }
      }, reject);
    });
  }

}
