import {} from 'jasmine'; // Some editors need this for lint
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RequestModule } from '../shared/request/request.module';
import { CacheModule } from '../shared/cache/cache.module';
import { IonicStorageModule } from '@ionic/storage';
import { MilestoneService } from '../services/milestone.service';

describe('Milestone Service test', () => {

  beforeEach(() => {

    // Configure module before start test
    TestBed.configureTestingModule({
      providers: [

        // Import the service you need to test
        { provide: MilestoneService, useClass: MilestoneService }
      ],
      imports: [
        // Use for generate mock http response
        HttpClientTestingModule,

        // MilestoneService need this for http request
        RequestModule,
        RequestModule.forRoot({
          // Configure is not important because we response mock data
          appKey: '',
          prefixUrl: ''
        }),

        // RequestModule need this for load apiKey from localstorage
        CacheModule,
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
    // Assign MilestoneService to a variable
    const milestoneService = TestBed.get(MilestoneService);
    // Assign HttpTestingController to a variable
    const http = TestBed.get(HttpTestingController);

    // Our expected response from server
    const expectedMilestones = {
      success: true,
      status: 'success',
      cache: false,
      data: [
        {
          id: 1241,
          project_id: 281,
          name: 'Milestone A',
          description: 'Welcome to Milestone A ...',
          lead_image: 'http://imgurl',
          duration: 7,
          order: 0,
          visibility: 30,
          delivery: 2,
          is_locked: false
        }
      ]
    };

    // Call API
    let actualMilestones = [];
    milestoneService.getMilestones().subscribe((milestones) => {
      actualMilestones = milestones;
    });

    // Trigger http response
    http.expectOne('api/milestones.json').flush(expectedMilestones);

    // milestone should be equal to expectedMilestones.data
    expect(actualMilestones).toEqual(expectedMilestones.data);
  });
});
