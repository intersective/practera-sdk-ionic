import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'question',
  templateUrl: 'question.html',
})
export class QuestionComponent {
  @Input() question: any = {};
  @Input() answers: any = {};

  constructor(
    public navCtrl: NavController
  ) {}

  ngOnInit() {}
}
