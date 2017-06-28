import { Component, Input } from '@angular/core';

@Component({
  selector: 'oneof-question',
  templateUrl: './oneof.html'
})
export class OneofQuestionComponent {
  @Input() question;

  constructor() {}

}
