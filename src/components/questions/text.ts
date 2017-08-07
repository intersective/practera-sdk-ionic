import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'text-question',
  templateUrl: './text.html'
})
export class TextQuestionComponent implements OnInit {
  @Input() question;
  @Input() disabled;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() {}
}
