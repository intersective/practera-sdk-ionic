import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'file-question',
  templateUrl: './file.html'
})
export class FileQuestionComponent implements OnInit {
  @Input() question;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() {
    console.log(this.form);
  }

  upload(event) {
    console.log(event);
  }
}
