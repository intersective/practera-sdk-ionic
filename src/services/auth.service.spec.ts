import {} from 'jasmine';
import 'rxjs/Rx';
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage';
import { CacheComponent } from '../shared/cache/cache.component';
// service file
import { AuthService } from './auth.service';
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';

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
          name: '__app-vault',
          driverOrder: ['localstorage']
        })
      ],
      providers: [
        { provide: AuthService, useClass: AuthService },
        { provide: CacheService, useClass: CacheService },
        { provide: RequestService, useClass: RequestService }
      ]
    });
    injector = getTestBed();
    service = injector.get(AuthService);
    httpMock = injector.get(HttpTestingController);
  });
  describe('getUser()' , () => {
    it('return user data', () => {
      const fakeData = {
        email: "damon3@test.com",
        experience_id: 3,
        image: null,
        linkedinConnected: false,
        linkedin_url: null,
        name: "damon3",
        program_id: 6,
        project_id: 6,
        role: "participant",
        timeline_id: 7
      };
      service.getUser().subscribe(data => {
        expect(data.User).toEqual(fakeData);
      });
      // const req = httpMock.expectOne(`${service.API_URL}/api/users.json`);
      // const req = httpMock.expectOne(`http://local.practera.com:8080/api/users.json?timelineID=7`);
      // const req = httpMock.expectOne(`http://local.practera.com:8080/api/users.json`);
      // const req = httpMock.expectOne(`api/users.json`);
      const req = httpMock.expectOne({
        url: 'api/users.json',
        method: 'GET'
      });
      // expect(req.request.method).toBe('GET');
      req.flush(fakeData);
      // httpMock.match('http://local.practera.com:8080/api/users.json');
      // httpMock.verify();
    })
  });
  describe('loginAuth()' , () => {
    it('login successfully', () => {
      service.loginAuth('damon3@test.com', '123123123').subscribe(data => {
        expect(data).toBeFalsy();
      });
      httpMock.expectOne('authentication').flush(null, { 
        status: 200, statusText: 'Ok' 
      });
    })
  });
})

