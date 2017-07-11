import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { TranslationService } from '../../shared/translation/translation.service';
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
    public translationService: TranslationService
  ) {}
  ionViewDidEnter() {
    this.activity = this.navParams.get('activity');
    this.assessmentService.getAll().toPromise().then(assessments => {
      this.assessments = assessments;
    });
  }
}
