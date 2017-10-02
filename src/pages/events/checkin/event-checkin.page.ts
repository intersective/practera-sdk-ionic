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
  event: any;
  submissions: any;
  assessment: any;
  assessmentGroup: any;
  user: any = {};
  checkin: any = {};

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
    // We assume event checkin has just single submission
    this.checkin = this.getCheckinAnswer(this.submissions[0]);
    this.assessment = this.assessmentService.normaliseGroup(this.assessmentGroup);
    this.user = this.cache.getLocalObject('user');
  }

  // Only checkin/file upload answer is displayed in check-in view
  getCheckinAnswer(submission) {
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
