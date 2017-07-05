import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { i18nData } from './assets/i18n-en'; 
let _mock = {
    "id": 59,
    "name": "Test Achievement",
    "description": "this is test achievement",
    "badge": "https://www.filepicker.io/api/file/lRLLzZdwT0OWdxQq0ZJw",
    "visibility": 1,
    "condition": "AND",
    "model": "Program",
    "model_id": 158,
    "is_default": false,
    "scope": "individual",
    "points": 100,
    "achieved": false,
};

@Component({
  templateUrl: './achievements-view.html'
})
export class AchievementsViewPage {
  public achievement: any;

  constructor(
    private params: NavParams,
    public translate: TranslateService
  ) {
    translate.addLangs(["en"]);
    translate.setDefaultLang('en');
    translate.use('en');
    this.achievement = {};
  }

  ionViewDidEnter() {
    this.achievement = this.params.get('achievement');

    // Inject API response
    this.achievement = _mock;
  }
}
