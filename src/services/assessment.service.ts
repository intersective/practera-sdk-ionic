import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class AssessmentService {
  private targetUrl = 'api/assessments.json';

  constructor(private request: RequestService) {}

  // listAll()
  public getAssessments(options? : any) {
    return this.request.get(this.targetUrl)
      .map(response => response.json())
      .toPromise()
  }

}
