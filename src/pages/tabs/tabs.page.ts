import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { i18nData } from './assets/i18n-en';
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
  constructor(public translate: TranslateService) {
    translate.addLangs(["en"]);
    translate.setDefaultLang('en');
    translate.use('en');
    // this.tabDashboard = translate.get('TABS').subscribe( result => {
    //   this.tabDashboard = result.DASHBOARD; 
    // });
  }
}
