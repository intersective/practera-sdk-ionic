import { Component, ViewChild } from '@angular/core';
import { Events, NavController, Nav, Tabs } from 'ionic-angular';
import { ActivitiesListPage } from '../activities/list/list.page';
import { CacheService } from '../../shared/cache/cache.service';
import { EventsListPage } from '../events/list/list.page';
import { RankingsPage } from '../rankings/list/rankings.page';
import { SettingsPage } from '../settings/settings.page';
import { SpinwheelPage } from '../spinwheel/spinwheel.page';
import { TranslationService } from '../../shared/translation/translation.service';

import * as _ from 'lodash';

@Component({
  templateUrl: 'tabs.html',
  providers: []
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;

  // this tells the tabs component which Pages
  // should be each tab's root Page
  ranking: any = RankingsPage;
  dashboard: any = ActivitiesListPage;
  settings: any = SettingsPage;
  events: any = EventsListPage;
  spinner: any = SpinwheelPage;
  spins: number = null;

  constructor(
    public translationService: TranslationService,
    public eventListener: Events,
    public cacheService: CacheService
  ) {
    this.traceSpinProgress();
  }

  traceSpinProgress() {
    this.eventListener.subscribe('spinner:update', spin => {
      // cache items & containers
      this.cacheService.setLocalObject('items', spin.Items);
      this.cacheService.setLocalObject('containers', spin.Containers);

      let unopened = [];
      spin.Containers.forEach(container => {
        if (!container.opened) {
          unopened.push(container);
        }
      });

      this.spins = (unopened.length === 0) ? null : unopened.length;
    });
  }

}
