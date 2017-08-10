import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from 'ionic-angular';
// services
import { CacheService } from '../../../shared/cache/cache.service';
import { EventService } from '../../../services/event.service';
import { AssessmentService } from '../../../services/assessment.service';

import * as moment from 'moment';

@Component({
  selector: 'page-event-checkin',
  templateUrl: './event-checkin.html',
})
export class EventCheckinPage {
  public event: any;
  public submissions: any;
  public assessment;
  public assessmentGroup;
  private user: any = {};
  public checkin: any = {};

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private cache: CacheService,
    private eventService: EventService,
    private assessmentService: AssessmentService,
    private loadingCtrl: LoadingController
  ) {
    this.event = navParams.get('event');
    this.submissions = navParams.get('submissions');
    this.assessment = navParams.get('assessment');
    this.assessmentGroup = navParams.get('assessmentGroup');
  }

  ionViewDidEnter() {
    this.checkin = this.getCheckinAnswer(this.submissions[0]); // event checkin has just single submission
    this.assessment = this.assessmentService.normaliseGroup(this.assessmentGroup);
    this.user = this.cache.getLocalObject('user');
  }

  // Only checkin/file upload answer is displayed in check-in view
  private getCheckinAnswer(submission) {
    let result = {};
    submission.answer.forEach(ans => {
      if (typeof ans.answer === 'object') {
        result = ans;
      }
    });

    return result;
  }

  injectAssessmentToAnswer() {
    this.assessmentGroup.forEach(group => {
      console.log(group);
    });
  }
}
