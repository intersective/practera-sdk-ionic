import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { TranslationService } from '../../../shared/translation/translation.service';
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

  achievement: any;

  constructor(
    private params: NavParams,
    private translationService: TranslationService
  ) {
    this.achievement = {};
  }

  ionViewDidEnter() {
    this.achievement = this.params.get('achievement');

    // Inject API response
    this.achievement = _mock;
  }
}
