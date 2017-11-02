import { Component } from '@angular/core';

import { MilestoneService } from './milestone.service';

@Component({
  selector: 'test-milestone',
  template: ``
})
export class MilestoneComponentTest {

  constructor(
    public milestoneService: MilestoneService
  ) {}

  getMilestones() {
    return this.milestoneService.getMilestones();
  }
}
