import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

import * as _ from 'lodash';

@Injectable()
export class SubmissionService {
  private targetUrl = 'api/submissions.json';

  constructor(private request: RequestService) {}

  // list()
  public getSubmissions(options? : any) {
    return this.request.get(this.targetUrl)
      .map(response => response.json())
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

}
