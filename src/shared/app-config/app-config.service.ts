import { Injectable } from '@angular/core';
import { CacheService } from '../cache/cache.service';

// Pages
import { EventsListPage } from '../../pages/events/list/list.page';
import { GalleryPage } from '../../pages/gallery/gallery';
import { LevelsPage } from '../../pages/levels/list/list.page';
import { RankingsPage } from '../../pages/rankings/list/rankings.page';
import { SettingsPage } from '../../pages/settings/settings.page';
import { TeamPage } from '../../pages/team/team';

// Others
import * as _ from 'lodash';

@Injectable()
export class AppConfigService {
  // Mapping page to name,
  // use for changing page in tab menu
  pagesMap: any = {
    events: EventsListPage,
    rankings: RankingsPage,
    settings: SettingsPage,
    gallery: GalleryPage,
    team: TeamPage
  }

  // Example response from server
  /**
  appConfigContent: any = {
    app: {
      name: 'ISDK'
    },
    tabs: {
      events: {
        name: 'events',
        title: 'Events',
        icon: 'md-calendar',
        order: 1
      },
      rankings: {
        name: 'rankings',
        title: 'Rankings',
        icon: 'md-medal',
        order: 2
      },
      settings: {
        name: 'settings',
        title: 'Settings',
        icon: 'md-person',
        order: 3
      }
    }
  };
  **/

  constructor (
    private cacheService: CacheService
  ) {}

  /**
   * @description Get full configure data
   */
  get(): any {
    return this.cacheService.getLocal('appConfig');
  }

  /**
   * @description Get only configure for tabs
   */
  getTabs(): any {
    let appConfig: any = this.cacheService.getLocal('appConfig');
    if (!appConfig.tabs) {
      return appConfig.tabs;
    }

    let modules = _.sortBy(appConfig.tabs, [(o) => o.order]);
    return _.map(modules, (o) => {
      o.root = this.pagesMap[o.name];
      return o;
    });
  }
}
