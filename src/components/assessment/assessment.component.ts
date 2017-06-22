import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

// import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'assessment',
  templateUrl: 'assessment.html'
})
export class AssessmentComponent {
  @Input() assessment: any;

  constructor(
    public navCtrl: NavController
  ) {}

  ionViewDidEnter() {}

}
