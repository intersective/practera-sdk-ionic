import { Component, ViewChild } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
// pages
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs.page';
import { HomePage } from '../home/home';
import { ActivitiesListPage } from '../activities/list/list.page';
import { LevelsListPage } from '../levels/list/list';
/* This is side navigation bar which shows after user logged in to the app */
@Component({
  selector: 'page-sidenav',
  templateUrl: 'sidenav.html'
})
export class SidenavPage {
  @ViewChild('sideNav') sideNav: NavController;
  loginPage = LoginPage;
  tabsPage = TabsPage;
  homePage = HomePage;
  activitiesListPage = ActivitiesListPage;
  levelsListPage = LevelsListPage;
  rootPage = null;

  constructor(private menuCtrl: MenuController) {
    this.rootPage = LoginPage;
  }

  onLoad(page: any) {
    this.sideNav.setRoot(page);
    this.menuCtrl.close();
  } // handles when user login load specific page which selected/clicked by user

  onLogout() {
    localStorage.clear();
    this.menuCtrl.close();
    this.sideNav.setRoot(LoginPage);
  } // handles when user logout

  isLoggedin() {
    return localStorage.getItem('isAuthenticated') == 'true';
  }
  // this functin is to check if user is logged in, the value is turn to true,
  // navbar shows all listed page links, else navbar only show login link button
}
