import { Injectable } from '@angular/core';

// Services
import { MilestoneService } from './milestone.service';
import { ActivityService } from './activity.service';
// Others
import * as _ from 'lodash';

@Injectable()
export class LevelService {

  constructor(
    public activityService: ActivityService,
    public milestoneService: MilestoneService
  ) {}

  getLevels() {
    let milestones = [];
    let milestoneIds = [];

    return new Promise((resolve, reject) => {
      this.milestoneService.getList()
      .toPromise()
      .then((result: any) => {
        milestones = result.data;

        // Find unlocked milestones...
        _.forEach(milestones, (milestone) => {
          if (!milestone.is_locked) {
            milestoneIds.push(milestone.id);
          }
        });

        return this.activityService.getLevels({
          // @TODO: Should have some way to get data from stroage...
          search: {
            milestone_id: JSON.stringify(milestoneIds),
            has: []
          }
        });
      })
      .then((result: any) => {

        _.forEach(result.data, function(activity) {

          // Normalise activity data
          activity = this.activityService.normalise(activity);

          // Group activity to milestone...
          _.forEach(milestones, function(milestone, key) {
            if (milestone.id === activity.Activity.milestone_id) {
              milestones[key].activity = activity;
            }
          });
        });

        resolve(milestones);
      })
      .catch(reject);
    });

  }
}
