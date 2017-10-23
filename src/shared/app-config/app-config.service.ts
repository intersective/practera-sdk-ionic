import { Injectable } from '@angular/core';

// Others
import * as _ from 'lodash';

@Injectable()
export class AppConfigService {

  appConfigContent: any = {
    app: {
      name: 'ISDK'
    },
    modules: {
      activities: {
        title: 'Dashboard',
        visible: true,
        order: 0
      },
      events: {
        title: 'Events',
        visible: true,
        order: 1
      },
      rankings: {
        title: 'Rankings',
        visible: true,
        order: 2
      },
      settings: {
        title: 'Settings',
        visible: true,
        order: 3
      }
    }
  };

  get(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.appConfigContent);
    });
  }

  getModule(): Promise<any> {
    return this.get().then((data: any) => {
      return _.sortBy(data.modules, [(o) => o.order]);
    });
  }
}
