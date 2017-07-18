import { Component } from '@angular/core';
import { ModalController, NavParams, NavController } from 'ionic-angular';
import { ActivitiesViewModalPage } from './activities-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { SubmissionService } from '../../../services/submission.service';

import * as _ from 'lodash';

@Component({
  templateUrl: './view.html'
})

export class ActivitiesViewPage {
  activity: any = {};
  assessment: any = {};
  submissions: Array<any> = [];

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private submissionService: SubmissionService,
    private modalCtrl: ModalController
  ) {
  }


  // @TODO: use simple mock data for assessment first
  /**
   * on assessment implementation, to do list:
   * - load badges
   * - change icon display based on responded data format
   * - load submission into this.submissions
   * - change template view based on responded data format
   */
  ionViewDidEnter(): void {
    this.activity = this.normaliseActivity(this.navParams.get('activity') || {});
    this.assessment = this.activity.sequence;

    // @TODO: badges images implementation
    this.activity.badges = [
      {
        url: 'http://leevibe.com/images/category_thumbs/video/19.jpg',
        disabled: true,
      },
      {
        url: 'http://mobileapp.redcross.org.uk/achievements/heart-icon.png',
        disabled: true,
      },
      {
        url: 'http://americanredcross.3sidedcube.com/media/45334/fire-large.png',
        disabled: false,
      },
    ];

    let submission = [];
    this.submissionService.getSubmissions({
      search: { context_id: this.assessment.context_id }
    }).subscribe(response => {
      if (response.length > 0) {
        console.log(this.submissions);
        this.submissions = response.map(submission => this.submissionService.normalise(submission));
        console.log(this.submissions);
      }
    });

    if (this.activity.Activity.name === 'Workshop-2') {
      submission.push({
        title: 'Submission 1',
        submittedOn: 'Thu Jun 19 2017 17:37:08',
        status: 'Pending Review'
      });
      this.activity.badges.map((badge, index) => {
        if (index === 1 || index === 0) {
          badge.disabled = false;
        } else {
          badge.disabled = true;
        }
      });
    } else {
      submission.push({
        title: 'Submission 1',
        submittedOn: '',
        status: 'Do Now'
      });
    }

    this.submissions = submission;
    console.log(this.activity);
  }

  /**
   * normalise activities
   */
  private normaliseActivities(activities): Array<any> {
    let result = [];

    activities.forEach((act, index) => {
      result[index] = _.merge(act.Activity, {
        activity: act.Activity,
        sequences: act.ActivitySequence,
        Activity: act.Activity,
        ActivitySequence: act.ActivitySequence,
        References: act.References
      });
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
  private rebuildReferences(references) {
    let result = {};
    references.forEach(ref => {
      result[ref.Assessment.id] = ref.context_id;
    });
    return result;
  }

  /*
    @name mergeReferenceToSequence

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
        },
        "context_id": 25
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
  private mergeReferenceToSequence(activity) {
    let refs = this.rebuildReferences(activity.References);

    // @NOTE: first "[0]" sequence is the assessment of an activity
    let sequence = activity.ActivitySequence[0];
    // activity.ActivitySequence.forEach(seq => {
      let modelId = sequence.model_id;
      sequence.context_id = refs[modelId];
    // });
    return sequence;
  }

  /**
   * normalise single activity object
   */
  private normaliseActivity(activity) {
    let thisActivity = activity.Activity;

    return _.merge(thisActivity, {
      activity: activity.Activity,
      sequence: this.mergeReferenceToSequence(activity),
      Activity: activity.Activity,
      ActivitySequence: activity.ActivitySequence,
      References: activity.References
    });
  }

  /**
   * @description display activity detail modal page
   */
  openModal() {
    let detailModal = this.modalCtrl.create(ActivitiesViewModalPage, {activity: this.activity});
    detailModal.present();
  }

  /**
   * @name goAssessment
   * @description direct to assessment page of a selected activity
   * @param {Object} activity single activity object from the list of
   *                          activities respond from get_activities API
   */
  goAssessment(activity) {
    this.navCtrl.push(AssessmentsPage, {
      activity,
      assessment: this.assessment,
      submissions: this.submissions
    });
  }
}
