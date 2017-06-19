import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
// services
import { CacheService } from '../../../shared/cache/cache.service';
import { EventService } from '../../../services/event.service';
@Component({
  selector: 'page-event-checkin',
  templateUrl: './event-checkin.html',
})
export class EventCheckinPage {
  public event: any;
  constructor(
    private params: NavParams,
    private nav: NavController,
    private cache: CacheService,
    private eventService: EventService,
    private loadingCtrl: LoadingController,){
      // this.event = params.get('event');
  }
  ionViewDidEnter(){
    // this.event = this.params.get('event');
    // console.log("Event Data:", this.event);
  }
}
