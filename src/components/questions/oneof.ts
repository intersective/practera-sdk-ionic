import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'oneof-question',
  templateUrl: './oneof.html'
})
export class OneofQuestionComponent implements OnInit {
  @Input() question;
  @Input() form: FormGroup;
  @Output() oneofForm = new EventEmitter();

  constructor() {}
  change(e) {
    this.oneofForm.emit(e);
  }

  ngOnInit() {}
}
