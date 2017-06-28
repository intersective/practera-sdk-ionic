import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

// import { ActivityService } from '../../../services/activity.service';
// import { MilestoneService } from '../../../services/milestone.service';

@Component({
  selector: 'events',
  templateUrl: 'events.html'
})
export class EventsComponent {
  @Input() events;

  constructor(
    public navCtrl: NavController
  ) {}
}
