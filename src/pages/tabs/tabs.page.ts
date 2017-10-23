import { Component } from '@angular/core';

// Pages
import { ActivitiesListPage } from '../activities/list/list.page';
import { RankingsPage } from '../rankings/list/rankings.page';
import { SettingsPage } from '../settings/settings.page';
// import { TestPage } from './test.page';
import { EventsListPage } from '../events/list/list.page';
// Others
import { AppConfigService } from '../../shared/app-config/app-config.service';
import { TranslationService } from '../../shared/translation/translation.service';

@Component({
  templateUrl: 'tabs.html',
  providers: []
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  ranking: any = RankingsPage;
  // ranking: any = TestPage;
  dashboard: any = ActivitiesListPage;
  settings: any = SettingsPage;
  events: any = EventsListPage;

  tabs: any = [];

  constructor(
    public appConfig: AppConfigService,
    public translationService: TranslationService
  ) {}

  ionViewWillEnter() {
    this.appConfig.getModule().then(modules => {
      this.tabs = modules;
    });
  }
}
