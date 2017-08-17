import { Component } from '@angular/core';
import { TranslationService } from '../../shared/translation/translation.service';
import { ActivitiesListPage } from '../activities/list/list.page';
import { RankingsPage } from '../rankings/list/rankings.page';
import { SettingsPage } from '../settings/settings.page';
import { TestPage } from './test.page';
import { EventsListPage } from '../events/list/list.page';
@Component({
  templateUrl: 'tabs.html',
  providers: []
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  ranking: any = RankingsPage;
  dashboard: any = ActivitiesListPage;
  settings: any = SettingsPage;
  events: any = EventsListPage;
  spinner: any = EventsListPage;
  constructor(public translationService: TranslationService) {}
}
