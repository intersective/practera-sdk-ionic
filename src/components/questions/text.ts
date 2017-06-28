import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-question',
  templateUrl: './text.html'
})
export class TextQuestionComponent {
  @Input() question;
  constructor() {}
}
