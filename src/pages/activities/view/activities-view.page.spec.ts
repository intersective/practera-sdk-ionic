import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ActivitiesViewPage } from './activities-view.page';
import { ActivityService } from '../../../services/activity.service';
import { SubmissionService } from '../../../services/submission.service';

let fixture: ComponentFixture<ActivitiesViewPage>;
let component: ActivitiesViewPage;

describe('actiview view component', () => {

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [ActivitiesViewPage],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provider: ActivityService, useValue: 'activities'},
        { provider: SubmissionService, useValue: 'submission'},
      ]
    }).createComponent(ActivitiesViewPage);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  it('should has activity service imported', () => {
    expect(ActivitiesViewPage).toBeDefined();
  });

  it('should has detail content', () => {
    const de = fixture.debugElement.query(By.css('ion-content'));
    expect(de).toBeDefined();
  });
});


