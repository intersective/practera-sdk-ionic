import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'oneof-question',
  templateUrl: './oneof.html'
})
export class OneofQuestionComponent {
  @Input() question;
  @Input() questionForm;
  @Output() oneofForm = new EventEmitter();

  constructor() {}
  change(e) {
    console.log(e);
    console.log(this.question);
    this.oneofForm.emit(e);
  }
}
