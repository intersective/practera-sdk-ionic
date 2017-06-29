import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'oneof-question',
  templateUrl: './oneof.html'
})
export class OneofQuestionComponent {
  @Input() question;
  // @Output() oneofForm = new EventEmitter();

  constructor() {}

}
