import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

@Injectable()
export class AssessmentService {
  constructor(private request: RequestService) {}

  // listAll()
  public getAll(options? : any) {
    return this.request.get('api/assessments.json', options);
  }

}
