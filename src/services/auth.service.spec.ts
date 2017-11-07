import {} from 'jasmine';
import 'rxjs/Rx';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage';
import { CacheComponent } from '../shared/cache/cache.component';
// service file
import { AuthService } from './auth.service';
import { CacheService } from '../shared/cache/cache.service';
import { RequestModule } from '../shared/request/request.module';

describe('AuthService', () => {
  let injector;
  let service: AuthService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
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
        { provide: AuthService, useClass: AuthService },
        { provide: CacheService, useClass: CacheService }
      ]
    });
    injector = getTestBed();
    service = injector.get(AuthService);
    httpMock = injector.get(HttpTestingController);
  });
  // get users API returns
  describe('getUser()' , () => {
    it('return user data', () => {
      const fakeData = {
        email: 'test@test.com',
        experience_id: 3,
        image: null,
        linkedinConnected: false,
        linkedin_url: null,
        name: 'test',
        program_id: 6,
        project_id: 6,
        role: 'participant',
        timeline_id: 7
      };
      service.getUser().subscribe(data => {
        expect(data).toEqual(fakeData);
      });
      const req = httpMock.expectOne({
        url: 'api/users.json',
        method: 'GET'
      });
      req.flush(fakeData);
    })
  });
  // login authentication API returns
  describe('loginAuth()' , () => {
    it('login successfully', () => {
      const expectedLoggedInData = {
        success: true,
        tutorial: true,
        apikey: '7xxxxxxxa3fdxxxx9330a6',
        Timelines: [
          {
            Timeline: {
              id: 5,
              title: 'test 1 2016S2',
              start_date: '2016-10-23',
              state: 1
            },
            Program: {
              id: 4,
              name: 'test 1',
              max_achievable_points: 500
            },
            Project: {
              id: 7,
              name: 'test 1',
              description: 'This is test project',
              lead_image: null,
              emails: ''
            },
            Enrolment: {
              id: 3559,
              status: 'fullaccess'
            }
          }
        ],
        Teams: [
          {
            id: 1,
            name: 'Team 1'
          }
        ],
        Experience: {
          config: {}
        }
      };
      const userData = {
        email: 'test@test.com',
        password: 'w467r32a3yg3fy4#dfghjsdfsd'
      }
      let actualLoggedInData = {};
      service.loginAuth(userData.email, userData.password).subscribe(data => {
        actualLoggedInData = data;
      });
      httpMock.expectOne('api/auths.json?action=authentication').flush(expectedLoggedInData);
      expect(actualLoggedInData).toEqual(expectedLoggedInData);
    })
  });
})
