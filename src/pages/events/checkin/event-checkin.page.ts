import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from 'ionic-angular';
// services
import { CacheService } from '../../../shared/cache/cache.service';
import { EventService } from '../../../services/event.service';

import * as moment from 'moment';

@Component({
  selector: 'page-event-checkin',
  templateUrl: './event-checkin.html',
})
export class EventCheckinPage {
  public event: any;
  public submissions: any;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private cache: CacheService,
    private eventService: EventService,
    private loadingCtrl: LoadingController
  ) {
      this.event = navParams.get('event');
      this.submissions = navParams.get('submissions');
  }

  ionViewDidEnter() {
    console.log(this.event);
    console.log(this.submissions);
  }
}
