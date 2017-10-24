import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

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
