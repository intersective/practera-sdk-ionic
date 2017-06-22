import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as _ from 'lodash';

// import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'assessment',
  templateUrl: 'assessment.html'
})
export class AssessmentComponent {

  public assessment = {};

  constructor(
    public navCtrl: NavController
  ) {}

  ionViewDidEnter() {}

}
