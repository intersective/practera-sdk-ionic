import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class SubmissionService {
  private targetUrl = 'api/submissions.json';

  constructor(private request: RequestService) {}

  // list()
  public getSubmissions(options?: any) {
    return this.request.get(this.targetUrl, options);
  }

  public extractPhotos(data) {
    let photos = [];

    _.forEach(data, function(val, key) {
      _.forEach(val.AssessmentSubmissionAnswer, (answer, key) => {
        if (answer.answer && answer.answer.url !== undefined && answer.answer.mimetype !== undefined) {
          if (_.isString(answer.answer.mimetype) && answer.answer.mimetype.indexOf('image') !== -1) {
            // @TODO: I think we need standardise this format...
            photos.push({
              activity_id: val.AssessmentSubmission.activity_id,
              assessment_id: val.AssessmentSubmission.assessment_id,
              photo: answer.answer.url,
              submitted: val.AssessmentSubmission.submitted
            });
          }
        }
      });
    });

    return photos;
  }
/*
  Turns:
    {
      "AssessmentSubmission": {
        "id": 4,
        "submitter_id": 19,
        "created": "2017-07-18 03:28:09",
        "modified": "2017-07-18 03:28:09",
        "status": "done",
        "assessment_id": 28,
        "order": null,
        "submitted": "2017-07-18 03:28:12",
        "team_id": null,
        "program_id": 4,
        "activity_id": 23,
        "score": null,
        "moderated_score": "0",
        "publish_date": null,
        "review_score": "0",
        "timeline_id": 5,
        "context_id": 26
      },
      "Assessment": {
        "id": 28,
        "name": "Job Smart Initial Survey",
        "description": "This survey is a self-assessment of your employability skills. Be honest with yourself and leave room to improve. In the end of the program, you will be asked the same questions at the end of the program. Please take 5 minutes to reflect on your current state.<br>",
        "assessment_type": "survey",
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
        "modified": "2016-10-25 23:59:47",
        "review_instructions": null,
        "is_repeatable": false,
        "num_reviews": null,
        "review_type": null,
        "review_role": null,
        "visibility": {
          "guest": false,
          "participant": true,
          "mentor": true,
          "coordinator": true,
          "admin": false,
          "team": false,
          "sysadmin": false
        },
        "auto_assign_reviewers": null,
        "parent_id": null,
        "auto_publish_reviews": false
      },
      "AssessmentSubmissionAnswer": [
        {
          "id": 10,
          "assessment_submission_id": 4,
          "comment": null,
          "assessment_question_id": 92,
          "answer": 235,
          "score": "0"
        },
        {
          "id": 11,
          "assessment_submission_id": 4,
          "comment": null,
          "assessment_question_id": 93,
          "answer": 240,
          "score": "0"
        },
        {
          "id": 12,
          "assessment_submission_id": 4,
          "comment": null,
          "assessment_question_id": 94,
          "answer": 245,
          "score": "0"
        },
        {
          "id": 13,
          "assessment_submission_id": 4,
          "comment": null,
          "assessment_question_id": 95,
          "answer": 250,
          "score": "0"
        },
        {
          "id": 14,
          "assessment_submission_id": 4,
          "comment": null,
          "assessment_question_id": 96,
          "answer": 255,
          "score": "0"
        },
        {
          "id": 15,
          "assessment_submission_id": 4,
          "comment": null,
          "assessment_question_id": 97,
          "answer": 260,
          "score": "0"
        },
        {
          "id": 16,
          "assessment_submission_id": 4,
          "comment": null,
          "assessment_question_id": 98,
          "answer": 265,
          "score": "0"
        },
        {
          "id": 17,
          "assessment_submission_id": 4,
          "comment": null,
          "assessment_question_id": 99,
          "answer": 270,
          "score": "0"
        }
      ],
      "AssessmentReviewAnswer": []
    }

  into:
  {

  }
 */
  public normalise(respond) {
    let submission = respond['AssessmentSubmission'];
    let assessment = respond['Assessment'];
    let answer = respond['AssessmentSubmissionAnswer'];
    let review = respond['AssessmentReviewAnswer'];

    // preprocess date
    submission.created = moment.utc(submission.created);
    submission.modified = moment.utc(submission.modified);

    // submitted
    if (submission.submitted) {
      submission.submitted = moment.utc(submission.submitted);
    }

    return _.merge(submission, {
      assessment,
      answer,
      review
    });
  }

  /**
   * get assessment answer (submission)
   * @param {array} respond API respond from get_submissions
   */
  public getAnswer(respond, activityId?: number) {
    let answer = this.normalise(respond).answer;
    return answer;
  }

  /**
   * get review (feedback from moderator)
   */
  public getReview(review) {
    return review;
  }

  /**
   * extract reference IDs and prepare Observables to retrieve submissions
   * @param {array} references References array responded with get_activities() api
   */
  public getSubmissionsByReferences(references) {
    let tasks = []; // multiple API requests

    // get_submissions API to retrieve submitted answer
    let getSubmissions = (contextId) => {
      return this.getSubmissions({
        search: {
          context_id: contextId
        }
      });
    };

    // Congregation of get_submissions API Observable with different context_id
    _.forEach(references, reference => {
      if (reference.context_id) {
        return tasks.push(getSubmissions(reference.context_id));
      }
    });

    return tasks;
  }

  // get user submissions data
  // @TODO Remove it later
  public getSubmissionsData() {
    return this.getSubmissions()
  }
}
