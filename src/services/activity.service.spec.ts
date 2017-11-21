import { TestBed, getTestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage';
import { CacheModule } from '../shared/cache/cache.module';
import { CacheComponent } from '../shared/cache/cache.component';

// service file
import { ActivityService } from './activity.service';
import { CacheService } from '../shared/cache/cache.service';
import { RequestModule } from '../shared/request/request.module';

let httpMock: HttpTestingController;
let service: ActivityService;

describe('ActivityService', () => {
  beforeEach(() => {
    let module = {
      declarations: [

      ],
      imports: [
        HttpClientTestingModule,
        IonicStorageModule.forRoot({
          name: '__test-app-vault',
          driverOrder: ['localstorage']
        }),
        RequestModule.forRoot({
          appKey: '',
          prefixUrl: ''
        }),
        CacheModule
      ],
      providers: [
        ActivityService,
        CacheService
      ]
    };

    TestBed.configureTestingModule(module)
    .overrideModule(CacheModule, {
      add: {
        declarations: [
          CacheComponent
        ]
      }
    })
    .compileComponents()
    .then(() => {
      service = TestBed.get(ActivityService);
      httpMock = TestBed.get(HttpTestingController);
    });
  });

  it('activity service is defined', () => {
    inject([ActivityService], (service: ActivityService) => {
      expect(service instanceof ActivityService).toBe(true);
    });
  });

  describe('when getActivities', () => {
    let backend: HttpClientTestingModule;
    let service: ActivityService;
    let fakeActivities;
    let response: Response;

    it('should get activity list', () => {
      inject([HttpTestingController, service], (httpMock: HttpTestingController,
        service: ActivityService) => {

        let result:any;
        service.getList().subscribe((res) => {
          result = res;
          console.log(res);
        });

        httpMock.expectOne('api/activities.json').flush({
          data: true
        });
      });
    });
  })
})
