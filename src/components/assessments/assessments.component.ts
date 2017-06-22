import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

// import * as _ from 'lodash';

// import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'assessments',
  templateUrl: 'assessments.html'
})
export class AssessmentsComponent {
  @Input() activityData: any;

  assessments: any;

  constructor(
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    this.assessments = this.activityData.ActivitySequence;
    console.log('this.assessments', this.assessments)
  }

}
