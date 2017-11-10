import { Component } from '@angular/core';

// Pages
import { ActivitiesListPage } from '../activities/list/list.page';
import { RankingsPage } from '../rankings/list/rankings.page';
import { SettingsPage } from '../settings/settings.page';
import { TestPage } from './test.page';
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

  // We need hardcode at least one tab in menu,
  // otherwise any misconfigure will break the page
  dashboard: any = ActivitiesListPage;
  tabs: any = [];

  constructor(
    public appConfigService: AppConfigService,
    public translationService: TranslationService
  ) {}

  ionViewWillEnter() {
    this.tabs = this.appConfigService.getTabs();
  }
}
