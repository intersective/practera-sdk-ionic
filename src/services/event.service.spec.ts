import {} from 'jasmine'; // Some editors need this for lint
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RequestModule } from '../shared/request/request.module';
import { CacheModule } from '../shared/cache/cache.module';
import { IonicStorageModule } from '@ionic/storage';
import { EventService } from '../services/event.service';

describe('Event Service test', () => {

  beforeEach(() => {

    // Configure module before start test
    TestBed.configureTestingModule({
      providers: [

        // Import the service you need to test
        { provide: EventService, useClass: EventService }
      ],
      imports: [
        // Use for generate mock http response
        HttpClientTestingModule,

        // Service need this for http request
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

  xit('should list the events', () => {
    const eventService = TestBed.get(EventService);
    // Assign HttpTestingController to a variable
    const http = TestBed.get(HttpTestingController);

    // Our expected response from server
    const expectedResponse = {
      "success":true,
      "status":"success",
      "cache":false,
      "data":[
        {
          "id":13694,
          "activity_id":4610,
          "start":"2016-08-09 06:00:00",
          "end":"2016-08-09 08:00:00",
          "location":"ABS Lecture Theatre 1110",
          "title":"Job Smart Foundational experience - orientation ",
          "description":"",
          "capacity":300,
          "remaining_capacity_percentage":31.3,
          "remaining_capacity":94,
          "isBooked":false,
          "isOriginal":true,
          "files":[
            {
              "name":"attachment.jpg",
              "type":"image/jpeg",
              "url":"https://www.filepicker.io/api/file/Mbc3Rp2SQC4cROhSfq9O"
            }
          ],
          "References":[
            {
              "context_id":1,
              "Assessment":{
                "id":1,
                "name":"Moderated Assessment"
              }
            }
          ]
        }
      ]
    };

    // Call API
    let actualResponse = [];
    eventService.getEvents().then((events) => {
      actualResponse = events;
    });

    // Trigger http response
    // @TODO https://github.com/angular/angular/issues/19974
    http.expectOne("api/events.json").flush(expectedResponse);

    expect(actualResponse).toEqual(expectedResponse.data);
  });

  xit('should book an events', () => {
    const eventService = TestBed.get(EventService);
    // Assign HttpTestingController to a variable
    const http = TestBed.get(HttpTestingController);

    // Our expected response from server
    const expectedResponse = {
      success: true,
      status: 'success',
      data: 'booking successful'
    };

    // Call API
    let actualResponse = [];
    eventService.bookEvent().subscribe((success) => {
      actualResponse = success;
    });

    // Trigger http response
    http.expectOne('api/book_events.json').flush(expectedResponse);

    expect(actualResponse).toEqual(expectedResponse.data);
  });

  it('should cancel an events', () => {
    const eventService = TestBed.get(EventService);
    // Assign HttpTestingController to a variable
    const http = TestBed.get(HttpTestingController);

    // Our expected response from server
    const expectedResponse = {
      success: true,
      status: 'success',
      cache: false,
      data: {
        msg: 'Booking successfully withdrawn'
      }
    };

    // Call API
    let actualResponse = [];
    eventService.cancelEventBooking('fake_id').subscribe((success) => {
      actualResponse = success;
    });

    // Trigger http response
    http.expectOne('api/book_events.json').flush(expectedResponse);

    expect(actualResponse['msg']).toEqual(expectedResponse.data.msg);
  });
});
