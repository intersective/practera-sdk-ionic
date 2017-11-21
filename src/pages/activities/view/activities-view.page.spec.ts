import { BrowserModule } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
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
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';

// angular-moment module
import { MomentModule } from 'angular2-moment';

// shared modules
import {
  CacheModule,
  RequestModule,
  TranslationModule,
  TranslationService,
} from '../../../shared';

import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, HttpClient } from '@angular/common/http';
let fixture: ComponentFixture<ActivitiesViewPage>;
let component: ActivitiesViewPage;

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n-", ".json");
}


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
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        }),
        TranslationModule,
        MomentModule,
        CacheModule,
        RequestModule.forRoot({
          appKey: '',
          prefixUrl: ''
        })
      ],
      providers: [
        ActivityService,
        SubmissionService,
        TranslateService,
        { provide: AlertController, useClass: AlertMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: NavController, useClass: NavCtrlMock },
        { provide: ModalController, useClass: ModalCtrlMock}
      ]
    })
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

    // Object({ available: [  ], obtained: Object({  }), maxPoints: Object({  }) })
    expect(component.achievements).toEqual({
      available: [],
      obtained: {},
      maxPoints: {}
    });

    // expect(component.achievements).toContain

    expect(component.activity).toBeDefined();
    expect(component.assessment).toBeDefined();
    expect(component.loadings.submissions).toBeFalsy();
    expect(component.submissions).toBeDefined();
  });

  it('should has detail content', () => {
    const de = fixture.debugElement.query(By.css('ion-content'));
    expect(de).toBeDefined();
  });
});


