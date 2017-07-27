import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.html'
})
export class FeedbackComponent implements OnInit {
  @Input() question;

  constructor() {}

  ngOnInit() {}
}
