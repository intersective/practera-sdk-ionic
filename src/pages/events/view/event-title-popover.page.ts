import { Injectable, Component } from '@angular/core';
import { NavParams, PopoverController } from 'ionic-angular';
@Injectable()
@Component({
  selector: 'event-title-popover-page',
  template: `
    <p style="text-align: center;">{{ title }}</p>
  `
})
export class EventTitlePopoverPage {
  public title = 'Event';
  constructor(public navParams: NavParams,
    public popoverCtrl: PopoverController){
     this.title = this.navParams.get('eventTitle');
  }  
}
