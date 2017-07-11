import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import _ from 'lodash';
// services
import { AssessmentService } from '../../../services/assessment.service';
import { CacheService } from '../../../shared/cache/cache.service';
import { EventService } from '../../../services/event.service';
@Component({
  selector: 'page-event-checkin',
  templateUrl: './event-checkin.html',
})
export class EventCheckinPage {
  public event: any;
  private assessmentId: any;
  private assessmentData: any;
  constructor(
    private params: NavParams,
    private nav: NavController,
    private cache: CacheService,
    private eventService: EventService,
    private assessmentService: AssessmentService,
    private loadingCtrl: LoadingController,){
      this.event = params.get('event');
      this.assessmentId = this.event.References[0].Assessment.id;
      console.log("References Data: ", this.assessmentId);
      this.assessmentService.getEventAssesement(this.assessmentId)
          .subscribe( data => {
            this.assessmentData = data.assessments;
            console.log(this.assessmentData);
          },
          err => {
            console.log(err);
          });
    }
  // ionViewDidEnter(){
    // this.event = this.params.get('event');
    // console.log("Reference Data:", this.event);
  // }
}
