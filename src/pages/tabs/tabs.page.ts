import { Component } from '@angular/core';
import { TranslationService } from '../../shared/translation/translation.service';
// pages
import { HomePage } from '../home/home';
import { GalleryPage } from '../gallery/gallery';
import { ActivitiesListPage } from '../activities/list/list.page';
import { LevelsListPage } from '../levels/list/list';
import { TeamPage } from '../team/team';
import { SettingsPage } from '../settings/settings.page';
import { TestPage } from './test.page';
import { EventsListPage } from '../events/list/list.page';
// @TODO: remove after fully developed
// import { TestPage } from '../../shared/testModules/pages/test/test.page';
// import { TestPage } from '../../shared/testModules/pages/test/test.page';
@Component({
  templateUrl: 'tabs.html',
  providers: []
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab0Root: any = TestPage;
  tab1Root: any = HomePage;
  tab2Root: any = ActivitiesListPage;
  tab3Root: any = GalleryPage;
  tab5Root: any = LevelsListPage;
  tab6Root: any = TeamPage;
  tab7Root: any = SettingsPage;
  tab8Root: any = EventsListPage;
  // public tabDashboard: any;
  constructor(public translationService: TranslationService) {}
}
