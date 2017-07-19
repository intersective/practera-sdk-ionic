import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'questionGroup',
  templateUrl: 'questionGroup.html',
})
export class QuestionGroupComponent {
  @Input() group: any = {};

  constructor(
    public navCtrl: NavController
  ) {}

  ngOnInit() {}
}
