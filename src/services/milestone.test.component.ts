import { Component } from '@angular/core';

import { MilestoneService } from './milestone.service';

@Component({
  selector: 'test-milestone',
  template: ``
})
export class MilestoneTestComponent {

  constructor(
    public milestoneService: MilestoneService
  ) {}

  getMilestones() {
    return this.milestoneService.getMilestones();
  }
}
