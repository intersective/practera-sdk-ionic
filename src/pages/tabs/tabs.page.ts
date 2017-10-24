import { Component } from '@angular/core';

// Pages
import { ActivitiesListPage } from '../activities/list/list.page';
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

  // We need hardcode at least one tab menu,
  // otherwise any misconfigure will break
  dashboard: any = ActivitiesListPage;
  tabs: any = [];

  constructor(
    public appConfig: AppConfigService,
    public translationService: TranslationService
  ) {}

  ionViewWillEnter() {
    this.appConfig.getTabs().then(modules => {
      this.tabs = modules;
    });
  }
}
