import { Component, Input } from '@angular/core';

@Component({
  selector: 'file-question',
  templateUrl: './file.html'
})
export class FileQuestionComponent {
  @Input() question;
  constructor() {}
}
