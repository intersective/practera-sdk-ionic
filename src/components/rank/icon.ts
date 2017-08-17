import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rankIcon',
  templateUrl: './icon.html'
})
export class RankIconComponent implements OnInit {
  @Input() rank;

  constructor() {}

  ngOnInit() {}
}
