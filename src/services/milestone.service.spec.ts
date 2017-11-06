import {} from 'jasmine';
import { TestBed } from '@angular/core/testing';
import { CacheModule } from '../shared/cache/cache.module';
import { MilestoneService } from '../services/milestone.service';
import { RequestModule } from '../shared/request/request.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage';

describe('Milestone Service test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MilestoneService, useClass: MilestoneService }
      ],
      imports: [
        HttpClientTestingModule,
        RequestModule,
        CacheModule,
        RequestModule.forRoot({
          appKey: '',
          prefixUrl: ''
        }),
        IonicStorageModule.forRoot({
          name: '__test-app-vault',
          driverOrder: [
            'localstorage'
          ]
        })
      ]
    });
  });

  it('should list the milestones', () => {
    const milestoneService = TestBed.get(MilestoneService);
    const http = TestBed.get(HttpTestingController);

    const expectedMilestones = {
      success: true,
      status: 'success',
      cache: false,
      data: [
        {
          id: 1241,
          project_id: 281,
          name: 'Foundation',
          description: 'Welcome to Practera and your learning project...',
          lead_image: 'http://imgurl',
          duration: 7,
          order: 0,
          visibility: 30,
          delivery: 2,
          is_locked: false
        }
      ]
    };
    let actualMilestones = [];

    milestoneService.getMilestones().subscribe((milestones) => {
      actualMilestones = milestones;
    });

    http.expectOne('api/milestones.json').flush(expectedMilestones);
    expect(actualMilestones).toEqual(expectedMilestones.data);
  });
});
