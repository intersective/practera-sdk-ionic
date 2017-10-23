import { Injectable } from '@angular/core';

// Pages
import { EventsListPage } from '../../pages/events/list/list.page';
import { GalleryPage } from '../../pages/gallery/gallery.page';
import { LevelsPage } from '../../pages/levels/list/list.page';
import { RankingsPage } from '../../pages/rankings/list/rankings.page';
import { SettingsPage } from '../../pages/settings/settings.page';
import { TeamPage } from '../../pages/team/team.page';

// Others
import * as _ from 'lodash';

@Injectable()
export class AppConfigService {
  pagesMap: any = {
    events: EventsListPage,
    rankings: RankingsPage,
    settings: SettingsPage,
    gallery: GalleryPage,
    team: TeamPage
  }

  // JSON format sent back from server
  appConfigContent: any = {
    app: {
      name: 'ISDK'
    },
    modules: {
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

  get(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.appConfigContent);
    });
  }

  getModule(): Promise<any> {
    return this.get().then((data: any) => {
      return _.sortBy(data.modules, [(o) => o.order]);
    }).then((data: any) => {
      return _.map(data, (o) => {
        o.root = this.pagesMap[o.name];
        return o;
      });
    });
  }
}
