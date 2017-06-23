import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'assessments',
  templateUrl: 'assessments.html',
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
}
