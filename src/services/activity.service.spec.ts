
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage';
import { CacheComponent } from '../shared/cache/cache.component';
// service file
import { ActivityService } from './activity.service';
import { CacheService } from '../shared/cache/cache.service';
import { RequestModule } from '../shared/request/request.module';

describe('ActivityService', () => {
  let injector;
  let service: ActivityService;
  let httpMock: HttpTestingController;
  let activityService;

  beforeEach(() => {
    let module = {
      declarations: [
        CacheComponent
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
        })
      ],
      providers: [
        { provide: ActivityService, useClass: ActivityService },
        { provide: CacheService, useClass: CacheService }
      ]
    };

    TestBed.createComponent(ActivityService);
    activityService = TestBed.get(ActivityService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('true is true', () => expect(true).toBe(true));

  it('should get activity list', () => {
    let result:any;
    activityService.getList().subscribe((res) => {
      result = res;
      console.log(res);
    });

    httpMock.expectOne('api/activities.json').flush({
      data: true
    });
    expect(result).toBe({});
  })
})
