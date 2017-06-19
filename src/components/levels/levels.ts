import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ActivityService } from '../../../services/activity.service';
import { MilestoneService } from '../../../services/milestone.service';

@Component({
  selector: 'levels',
  templateUrl: 'levels.html'
})
export class LevelsComponent {
  constructor(
    public navCtrl: NavController
  ) {}
}
