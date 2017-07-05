import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { i18nData } from './assets/i18n-en'; 
// services
import { AssessmentService } from '../../services/assessment.service';
@Component({
  templateUrl: './assessment.html'
})
export class AssessmentsPage {
  activity;
  assessments;
  constructor(
    private navParams: NavParams,
    private assessmentService: AssessmentService,
    public translate: TranslateService
  ) {
    translate.addLangs(["en"]);
    translate.setDefaultLang('en');
    translate.use('en');
  }
  ionViewDidEnter() {
    this.activity = this.navParams.get('activity');
    this.assessmentService.getAll().toPromise().then(assessments => {
      this.assessments = assessments;
    });
  }
}
