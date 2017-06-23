import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

// import * as _ from 'lodash';

// import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'assessments',
  templateUrl: 'assessments.html'
})
export class AssessmentsComponent {
  @Input() assessmentsData: any;

  assessments: any;

  constructor(
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    this.assessments = this.assessmentsData;
  }

  truncate(str, length = 150) {
    if (str.length < length) {
      return str;
    }

    return str.slice(0, length - 1) + '...';
  }

}
