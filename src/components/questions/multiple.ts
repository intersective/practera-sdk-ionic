import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'multiple-question',
  templateUrl: './multiple.html'
})
export class MultipleQuestionComponent implements OnInit {
  @Input() question;
  @Input() disabled;
  @Input() form: FormGroup;

  constructor() {}

  change(e) {
    console.log(e);
    console.log(this.question);
  }

  ngOnInit() {
    console.log(this.form);
  }
}
