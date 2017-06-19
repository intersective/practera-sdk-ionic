import { Component, Input } from '@angular/core';

@Component({
  selector: 'activity',
  templateUrl: 'activity.html'
})
export class ActivityComponent {
  @Input() activity;

  public view(activity) {

  }

  public hasReservation(activity) {
    return false;
  }

  public viewTicket(activity) {

  }

  public book(activity) {

  }
}
