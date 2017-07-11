import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class AssessmentService {
  constructor(private request: RequestService) {}

  // listAll()
  public getAll(options?: any) {
    return this.request.get('api/assessments.json', options);
  }

  /**
   * get question's details
   * example:
   *   - for multiple-type question, checkbox data is not available in
   *     ActivitySequences (from get_activities API) and get_assessments API
   *   - checkbox values (selected checkbox ids are required for post_assessments API) which
   *     they are only available in this get_export_assessments api
   *
   * @param {any} options [description]
   */
  public getQuestion(options?: any) {
    return this.request.get('api/export_assessments.json', options);
  }
}
