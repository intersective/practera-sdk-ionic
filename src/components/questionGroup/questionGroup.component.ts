import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

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
