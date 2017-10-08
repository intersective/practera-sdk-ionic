import { Injectable }    from '@angular/core';
import { URLSearchParams } from '@angular/http';
import * as moment from 'moment';
import * as _ from 'lodash';
// services
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';

class ActivityBase {
  id: number;
  name: string;
  description: string;
  milestone_id?: number;
  deadline?: string;
  end?: string;
  lead_image?: string;
  is_locked?: boolean;
  order?: number;
  instructions?: string;
  video_url?: string;
}

class ReferenceAssessmentBase {
  id: number;
  name: string;
}

class ReferenceBase {
  context_id: number;
  Assessment: ReferenceAssessmentBase;
}

@Injectable()
export class ActivityService {
  private cachedActivites = {};

  public milestoneID = this.cacheService.getLocalObject('milestone_id');
  constructor(
    private request: RequestService,
    private cacheService: CacheService,
  ) {}

  public getList(options?) {
    let mid = this.cacheService.getLocal('milestone_id');

    options = options || {
      search: {
        milestone_id: this.cacheService.getLocal('milestone_id')
      }
    };

    if (!this.cachedActivites[mid]) {
      this.cachedActivites[mid] = this.request.get('api/activities.json', options);
      return this.request.get('api/activities.json', options);
    }

    return this.cachedActivites[mid];
  }

  public getLevels = (options?: any) => {
    let params: URLSearchParams = new URLSearchParams();
    if (options.search) {
      _.forEach(options.search, (value, key) => {
        params.set(key, value);
      });
      options.search = params;
    }
    return this.cacheService.read()
      .then((data: any) => {
        if (!options.search.timeline_id && data.user.timeline_id) {
          params.set('timeline_id', data.user.timeline_id);
          options.search = params;
        }
        if (!options.search.project_id && data.user.project_id) {
          params.set('project_id', data.user.project_id);
          options.search = params;
        }
        return this.getList(options).toPromise();
      });
  }

  /*
   // commented out - seems not using in any part of the code
   // it was built for currentActivities component in HomePage,
   // no longer using it now

   normalise(activity, index) {
    // session
    activity.enabledRSVP = true;
    // survey
    activity.due = false;
    activity.isRunning = false;
    activity.isBookable = false;
    activity.is_locked = activity.Activity.is_locked;
    activity.name = activity.Activity.name;
    activity.id = activity.Activity.id;
    activity.hasSession = false;
    activity.description = activity.Activity.description || 'No description available.';
    // pre-process response data
    activity.start = moment.utc(activity.Activity.start);
    activity.deadline = moment.utc(activity.Activity.deadline);
    activity.end = moment.utc(activity.Activity.end);
    // if sorting is not available, use index instead
    activity.order = activity.Activity.order || index;
    return activity;
  }*/


  /**
   * normalise activities
   */
  public normaliseActivities(activities): Array<any> {
    let result = [];

    activities.forEach((act, index) => {
      result[index] = this.normaliseActivity(act);
    });
    return result;
  }

  /**
   * normalise single activity object
   */
  public normaliseActivity(activity) {
    let thisActivity = activity.Activity,
        normalisedActivity: ActivityBase,
        sequence = this.mergeReferenceToSequence(activity);

    normalisedActivity = {
      id: activity.Activity.id,
      name: activity.Activity.name,
      description: activity.Activity.description,
      milestone_id: activity.Activity.milestone_id,
      deadline: activity.Activity.deadline,
      end: activity.Activity.end,
      lead_image: activity.Activity.lead_image,
      is_locked: activity.Activity.is_locked,
      order: activity.Activity.order,
      instructions: activity.Activity.instructions,
      video_url: activity.Activity.video_url
    };

    activity =  _.merge(thisActivity, {
      // front end should use the one with smallcase instead
      activity: normalisedActivity,
      sequence: sequence,
      assessment: this.extractAssessment(sequence),

      // raw data (don't touch/edit)
      Activity: activity.Activity,
      ActivitySequence: activity.ActivitySequence,
      References: activity.References
    });

    // Normalise activity reference (References object is optional, updated on 6 October 2017)
    if (activity.References) {
      activity.References = this.normaliseReferences(activity.References);
    }

    return activity;
  }

  /**
   * @name normaliseReferences
   * @description simplify references object for value access
   * @param {Array} references references array objects in an single activity
   */
  normaliseReferences(references) {
    let result: Array<ReferenceBase>;

    result = references.map(reference => {
      let referenceAssessment: ReferenceAssessmentBase = {
        id: reference.Assessment.id,
        name: reference.Assessment.name,
      };

      return {
        context_id: reference.context_id,
        Assessment: referenceAssessment
      };
    });

    return result;
  }

  /*
    turns:
    [
      {
        "context_id": 25,
        "Assessment": {
          "id": 19,
          "name": "Check-In Workshop 1"
        }
      },
      {
        "context_id": 26,
        "Assessment": {
          "id": 20,
          "name": "Check-In Workshop 2"
        }
      },
      ...
    ]

    into:
    {
      19: 25,
      20: 26
    }
   */
  public rebuildReferences(references) {
    let result = {};
    (references || []).forEach(ref => {
      result[ref.Assessment.id] = ref.context_id;
    });
    return result;
  }


  /**
   * @name mergeReferenceToSequence
   * @description merge context_id into assessments
   * @type {Object} activity single activity object
   * @example conversion formats below
   */
  /*
    turns:
    [
      {
        "id": 52,
        "activity_id": 22,
        "model": "Assess.Assessment",
        "model_id": 19,
        "order": 0,
        "is_locked": false,
        "Assess.Assessment": {
          "id": 19,
          "name": "Check-In Workshop 1",
          "description": "Check in to your first workshop here<br>",
          "assessment_type": "checkin",
          "is_live": true,
          "is_team": false,
          "score_type": "numeric",
          "experience_id": 2,
          "program_id": 4,
          "deleted": false,
          "deleted_date": null,
          "comparison_group_size": 3,
          "comparison_group_points": 10,
          "review_period": 72,
          "review_scope": "assessment",
          "review_scope_id": null,
          "created": "2016-02-01 04:45:21.573033",
          "modified": "2016-10-25 23:54:22",
          "review_instructions": null,
          "is_repeatable": false,
          "num_reviews": null,
          "review_type": null,
          "review_role": null,
          "auto_assign_reviewers": null,
          "parent_id": null,
          "auto_publish_reviews": false
        }
      }
    ]

    into:
    {
      "19": {
        "id": 52,
        "activity_id": 22,
        "model": "Assess.Assessment",
        "model_id": 19,
        "order": 0,
        "is_locked": false,
        "Assess.Assessment": {
          "id": 19,
          "name": "Check-In Workshop 1",
          "description": "Check in to your first workshop here<br>",
          "assessment_type": "checkin",
          "is_live": true,
          "is_team": false,
          "score_type": "numeric",
          "experience_id": 2,
          "program_id": 4,
          "deleted": false,
          "deleted_date": null,
          "comparison_group_size": 3,
          "comparison_group_points": 10,
          "review_period": 72,
          "review_scope": "assessment",
          "review_scope_id": null,
          "created": "2016-02-01 04:45:21.573033",
          "modified": "2016-10-25 23:54:22",
          "review_instructions": null,
          "is_repeatable": false,
          "num_reviews": null,
          "review_type": null,
          "review_role": null,
          "auto_assign_reviewers": null,
          "parent_id": null,
          "auto_publish_reviews": false
        },
        "context_id": 25
      }
    }
   */
  private mergeReferenceToSequence(activity): Object {
    // @NOTE: first "[0]" sequence is the assessment of an activity
    let sequence = (activity.ActivitySequence) ? activity.ActivitySequence[0] : {};

    // `References` object is optional now, updated on 6 October 2017
    if (activity.References) {
      let refs = this.rebuildReferences(activity.References);
      if (!_.isEmpty(sequence)) {
        // @NOTE: API only support first ActivitySequence atm
        // activity.ActivitySequence.forEach(seq => {
          let modelId = sequence.model_id;
          sequence.context_id = refs[modelId];
        // });
      }
    }
    return sequence;
  }

  /*
  turns:
    {
      "id": 52,
      "activity_id": 22,
      "model": "Assess.Assessment",
      "model_id": 19,
      "order": 0,
      "is_locked": false,
      "Assess.Assessment": {
        "id": 19,
        "name": "Check-In Workshop 1",
        "description": "Check in to your first workshop here<br>",
        "assessment_type": "checkin",
        "is_live": true,
        "is_team": false,
        "score_type": "numeric",
        "experience_id": 2,
        "program_id": 4,
        "deleted": false,
        "deleted_date": null,
        "comparison_group_size": 3,
        "comparison_group_points": 10,
        "review_period": 72,
        "review_scope": "assessment",
        "review_scope_id": null,
        "created": "2016-02-01 04:45:21.573033",
        "modified": "2016-10-25 23:54:22",
        "review_instructions": null,
        "is_repeatable": false,
        "num_reviews": null,
        "review_type": null,
        "review_role": null,
        "auto_assign_reviewers": null,
        "parent_id": null,
        "auto_publish_reviews": false
      },
      "context_id": 25
    }

    into:
    {
      "id": 19,
      "context_id": 25,
      "name": "Check-In Workshop 1",
      "description": "Check in to your first workshop here<br>",
      "assessment_type": "checkin",
      "is_live": true,
      "is_team": false,
      "score_type": "numeric",
      "experience_id": 2,
      "program_id": 4,
      "deleted": false,
      "deleted_date": null,
      "comparison_group_size": 3,
      "comparison_group_points": 10,
      "review_period": 72,
      "review_scope": "assessment",
      "review_scope_id": null,
      "created": "2016-02-01 04:45:21.573033",
      "modified": "2016-10-25 23:54:22",
      "review_instructions": null,
      "is_repeatable": false,
      "num_reviews": null,
      "review_type": null,
      "review_role": null,
      "auto_assign_reviewers": null,
      "parent_id": null,
      "auto_publish_reviews": false
    }
   */
  private extractAssessment(sequence) {
    let assessment: any = {};
    if (sequence['Assess.Assessment']) {
      assessment = sequence['Assess.Assessment'];
      assessment.context_id = sequence.context_id;
    }
    return assessment;
  }
}
