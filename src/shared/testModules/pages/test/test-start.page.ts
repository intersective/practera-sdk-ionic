import { Component, ViewChild, ViewChildren } from '@angular/core';
import { NavController } from 'ionic-angular';

// pages
import { AchievementsViewPage } from '../../../../pages/achievements/view/achievements-view.page';
import { AssessmentsGroupPage } from '../../../../pages/assessments/group/assessments-group.page';
import { ActivitiesClassicListPage } from '../../../../pages/activities-classic/list/activities-classic-list.page';
import { EventsListPage } from '../../../../pages/events/list/list.page';
import { EventsDownloadPage } from '../../../../pages/events/download/events-download.page';
import { GalleryPage } from '../../../../pages/gallery/gallery';
import { HomePage } from '../../../../pages/home/home';
import { LevelsListPage } from '../../../../pages/levels/list/list';
import { LoginPage } from '../../../../pages/login/login';
import { RegistrationPage } from '../../../../pages/registration/registration.page';
import { SettingsPage } from '../../../../pages/settings/settings.page';
import { TeamPage } from '../../../../pages/team/team';

const PAGES = [
  {
    name: 'Assessments Group',
    page: AssessmentsGroupPage
  },
  {
    name: 'Events',
    page: EventsListPage
  },
  {
    name: 'Events Download',
    page: EventsDownloadPage
  },
  {
    name: 'Home Page',
    page: HomePage
  },
  {
    name: 'Registration',
    page: RegistrationPage
  },
  {
    name: 'Gallery',
    page: GalleryPage
  },
  {
    name: 'Login',
    page: LoginPage
  },
  {
    name: 'Activities',
    page: ActivitiesClassicListPage
  },
  {
    name: 'Levels',
    page: LevelsListPage
  },
  {
    name: 'Teams',
    page: TeamPage
  },
  {
    name: 'Setting',
    page: SettingsPage
  },
  {
    name: 'Achievement View',
    page: AchievementsViewPage
  },
];

@Component({
  selector: 'my-test',
  templateUrl: 'test.html'
})
export class TestStartPage {
  items: Array<any> = PAGES;

  testPage;

  constructor(public nav: NavController) {
    console.log('ActivitiesClassicListPage', ActivitiesClassicListPage)
    console.log('??', ActivitiesClassicListPage);
  }

  goTo(nav) {
    this.testPage = nav.page;

    this.nav.push(nav.page);
  }
}
