import { BrowserModule } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  IonicModule,
  AlertController,
  NavParams,
  NavController,
  ModalController
} from 'ionic-angular';

import {
  AlertMock,
  NavParamsMock,
  NavCtrlMock,
  ModalCtrlMock
} from '../../../../test-config/mocks-ionic';

import * as Config from '../../../configs/config';

// pages
import { MyApp } from '../../../app/app.component';
import { ActivitiesViewPage } from './activities-view.page';
import { ActivitiesViewModalPage } from './activities-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessments.page';

// pipes
import { TruncatePipe } from '../../../pipes/truncate.pipe';

// services
import {
  ActivityService,
  SubmissionService
} from '../../../services';

// translation module
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// angular-moment module
import { MomentModule } from 'angular2-moment';

// shared modules
import {
  CacheModule,
  RequestModule,
  TranslationModule,
  TranslationService,
} from '../../../shared';

let fixture: ComponentFixture<ActivitiesViewPage>;
let component: ActivitiesViewPage;

describe('activie view component', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ActivitiesViewPage,
        TruncatePipe,
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        BrowserModule,
        TranslateModule,
        TranslationModule,
        MomentModule,
        CacheModule,
        RequestModule.forRoot({
          appKey: '',
          prefixUrl: ''
        }),
        IonicModule.forRoot(MyApp, {})
      ],
      providers: [
        ActivityService,
        SubmissionService,
        Config,
        { provide: AlertController, useClass: AlertMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: NavController, useClass: NavCtrlMock },
        { provide: ModalController, useClass: ModalCtrlMock}
      ]
    })
    /*.overrideModule(IonicModule, {
      add: {
        providers: [
        ]
      }
    })*/
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(ActivitiesViewPage);
      fixture.detectChanges();
      component = fixture.componentInstance;
    });
  }));

  it('should has activity service imported', () => {
    fixture = TestBed.createComponent(ActivitiesViewPage);
    fixture.detectChanges();
    component = fixture.componentInstance;

    expect(component.achievements).toBe({
      available: [],
      obtained: {},
      maxPoints: {}
    });

    expect(component.activity).toBeDefined();
    expect(component.assessment).toBeDefined();
    expect(component.loadings.submissions).toBeFalsy();
    expect(component.submissions).toBeDefined();
  });

  /*it('should has detail content', () => {
    const de = fixture.debugElement.query(By.css('ion-content'));
    expect(de).toBeDefined();
  });*/
});


