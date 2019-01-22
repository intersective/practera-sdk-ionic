import {} from 'jasmine';
import { Observable } from 'rxjs';
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
  
  // registration verification API returns
  describe('verifyRegistration()', () => {
    let registerVerifyTestCases = [
      // Case 1: lack of parameters without data return
      {
        returnUndefined: true,
        params: {
          email: null,
          key: '12*35$1#'
        },
        returnData: {

        },
        errorMsg: 'registration verification failed due to lack of parameters'
      },
      // Case 2: full parameters with data return
      {
        returnUndefined: false,
        params: {
          email: 'test@test.com',
          key: '3yg3fy4#'
        },
        returnData: {
          User: {
            id: 123,
            status: "registration"
          }
        },
        errorMsg: 'registration verification with API returns'
      }
    ];
    for (let index = 0; index < registerVerifyTestCases.length; index++) {
      let registerVerifyTestCase = registerVerifyTestCases[index];
      it(registerVerifyTestCase.errorMsg, () => {
        if (registerVerifyTestCase.returnUndefined) {
          expect(service.verifyRegistration(registerVerifyTestCase.params)).toBeUndefined();
        } else {
            let actualReturnedData = {};
            service.verifyRegistration(registerVerifyTestCase.params).subscribe(data => {
              actualReturnedData = data;
            });
            httpMock.expectOne('api/auths.json?action=verify_registration').flush(registerVerifyTestCase.returnData);
            expect(actualReturnedData).toEqual(registerVerifyTestCase.returnData);
        }
      });
    }
  });

  // registration API returns
  describe('register()', () => {
    let registerTestCases = [
      // Case 1: registration failed due to lack of parameters
      {
        returnUndefined: true,
        params: {
          password: null,
          user_id: 1,
          key: null
        },
        returnedData: {

        },
        errorMsg: 'registration failed due to lack of parameters'
      },
      // Case 2: registration process with API returns
      {
        returnUndefined: false,
        params: {
          password: '6w7rg3aa2fhwe#wefwadwefwef',
          user_id: 1,
          key: '3yg3fy4#'
        },
        returnedData: {
          Program: {
              id: 6,
              experience_id: 3,
              name: "Test Program",
              max_achievable_points: 0
          },
          Timeline: {
              id: 7,
              title: "Test Timeline",
              start_date: "2017-06-30",
              state: 0
          },
          Project: {
              id: 6,
              name: "TEST Project",
              description: "",
              lead_image: null,
              emails: ""
          },
          Enrolment: {
              id: 3600,
              status: "fullaccess"
          },
          apikey: "b335xxxaxa1dxxxf7b980e5"
        },
        errorMsg: 'registration process with API returns'
      }
    ];
    for(let index = 0; index < registerTestCases.length; index++){
      let registerTestCase = registerTestCases[index];
      it(registerTestCase.errorMsg, () => {
        if(registerTestCase.returnUndefined){
          expect(service.register(registerTestCase.params)).toBeUndefined();
        }else {
          let actualReturns = {};
          service.register(registerTestCase.params).subscribe(
            data => {
              actualReturns = data;
            }
          );
          httpMock.expectOne('api/auths.json?action=registration').flush(registerTestCase.returnedData);
          expect(actualReturns).toEqual(registerTestCase.returnedData);
        }
      })
    }
  });

  // login authentication API returns
  describe('loginAuth()' , () => {
    let loginTestCases = [
      // Case 1: login failed due to lack of parameters
      {
        returnUndefined: true,
        params: {
          email: null,
          password: 'w467r32a3yg3fy4#dfghjsdfsd'
        },
        returnedData: {

        },
        errorMsg: 'login failed due to lack of parameters'
      },
      // Case 2: login process with API returns
      {
        returnUndefined: false,
        params: {
          email: 'test@test.com',
          password: 'w467r32a3yg3fy4#dfghjsdfsd'
        },
        returnedData: {
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
                id: 3,
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
        },
        errorMsg: 'login process with API returns'
      }
    ];
    for(let index = 0; index < loginTestCases.length; index++){
      let loginTestCase = loginTestCases[index];
      it(loginTestCase.errorMsg, () => {
        if(loginTestCase.returnUndefined){
          expect(service.loginAuth(loginTestCase.params.email, loginTestCase.params.password)).toBeUndefined();
        }else {
          let actualReturns = {};
          service.loginAuth(loginTestCase.params.email, loginTestCase.params.password).subscribe(
            data => {
              actualReturns = data;
            }
          );
          httpMock.expectOne('api/auths.json?action=authentication').flush(loginTestCase.returnedData);
          expect(actualReturns).toEqual(loginTestCase.returnedData);
        }
      })
    }
  });

  // get users API returns
  describe('getUser()' , () => {
    it('return user data', () => {
      const userData = {
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
      let actualReturns = {};
      service.getUser().subscribe(data => {
        actualReturns = data;
      });
      const req = httpMock.expectOne({
        url: 'api/users.json',
        method: 'GET'
      });
      req.flush(userData);
      expect(actualReturns).toEqual(userData);
    })
  });

  // forgot password API returns
  describe('forgotPassword()', () => {
    const forgotPasswordTestCases = [
      // Case 1: forgot password failed without email input
      {
        returnUndefined: true,
        params: {
          email: null
        },
        returnedData: {

        },
        errorMsg: 'forgot password failed without email input'
      },
      // Case 2: forgot password email has been sent out
      {
        returnUndefined: false,
        params: {
          email: 'test@test.com'
        },
        returnedData: {
          data: null
        },
        errorMsg: 'forgot password email has been sent out'
      }
    ];
    for(let index = 0; index < forgotPasswordTestCases.length; index++){
      let forgotPasswordTestCase = forgotPasswordTestCases[index];
      it(forgotPasswordTestCase.errorMsg, () => {
        if(forgotPasswordTestCase.returnUndefined){
          expect(service.forgotPassword(forgotPasswordTestCase.params.email)).toBeUndefined();
        }else {
          let actualreturns = null;
          service.forgotPassword(forgotPasswordTestCase.params).subscribe(data => {
            actualreturns = data;
          })
          httpMock.expectOne('api/auths.json?action=forgot_password').flush(forgotPasswordTestCase.returnedData);
          expect(actualreturns).toEqual(forgotPasswordTestCase.returnedData);
        }
      })
    }
  });

  // // verify reset passoword API returns
  describe('verifyUserKeyEmail()', () => {
    const verifyResetPasswordTestCases = [
      // Case 1: verify reset password link failed due to lack of parameters
      {
        returnUndefined: true,
        params: {
          email: null,
          key: '3yg3fy4#'
        },
        returnedData: {

        },
        errorMsg: 'verify reset password link failed due to lack of parameters'
      },
      // Case 2: verify reset password with API returns
      {
        returnUndefined: false,
        params: {
          email: 'test@test.com',
          key: '3yg3fy4#'
        },
        returnedData: {
          data: null
        },
        errorMsg: 'verify reset password with API returns'
      }
    ];
    for(let index = 0; index < verifyResetPasswordTestCases.length; index++){
      let verifyResetPasswordTestCase = verifyResetPasswordTestCases[index];
      it(verifyResetPasswordTestCase.errorMsg, () => {
        if(verifyResetPasswordTestCase.returnUndefined){
          expect(service.verifyUserKeyEmail(verifyResetPasswordTestCase.params.key, verifyResetPasswordTestCase.params.email)).toBeUndefined();
        }else {
          let actualReturns = {};
          service.verifyUserKeyEmail(verifyResetPasswordTestCase.params.key, verifyResetPasswordTestCase.params.email).subscribe(
            data => {
              actualReturns = data;
            }
          );
          httpMock.expectOne('api/auths.json?action=verify_reset_password').flush(verifyResetPasswordTestCase.returnedData);
          expect(actualReturns).toEqual(verifyResetPasswordTestCase.returnedData);
        }
      })
    }
  });

  // reset passoword API returns
  describe('resetUserPassword()', () => {
    const resetPasswordTestCases = [
      // Case 1: reset password link failed due to lack of parameters
      {
        returnUndefined: true,
        params: {
          email: null,
          password: null,
          verify_password: null,
          key: '3yg3fy4#'
        },
        returnedData: {

        },
        errorMsg: 'reset password link failed due to lack of parameters'
      },
      // Case 2: reset password with API returns
      {
        returnUndefined: false,
        params: {
          email: 'test@test.com',
          password: '6w7rg3aa2fhwe#wefwadwefwef',
          verify_password: '6w7rg3aa2fhwe#wefwadwefwef',
          key: '3yg3fy4#'
        },
        returnedData: {
          data: null
        },
        errorMsg: 'reset password with API returns'
      }
    ];
    for(let index = 0; index < resetPasswordTestCases.length; index++){
      let resetPasswordTestCase = resetPasswordTestCases[index];
      it(resetPasswordTestCase.errorMsg, () => {
        if(resetPasswordTestCase.returnUndefined){
          expect(service.resetUserPassword(resetPasswordTestCase.params.email, resetPasswordTestCase.params.key, resetPasswordTestCase.params.password, resetPasswordTestCase.params.verify_password)).toBeUndefined();
        }else {
          let actualReturns = {};
          service.resetUserPassword(resetPasswordTestCase.params.email, resetPasswordTestCase.params.key, resetPasswordTestCase.params.password, resetPasswordTestCase.params.verify_password).subscribe(
            data => {
              actualReturns = data;
            }
          );
          httpMock.expectOne('api/auths.json?action=reset_password').flush(resetPasswordTestCase.returnedData);
          expect(actualReturns).toEqual(resetPasswordTestCase.returnedData);
        }
      })
    }
  });

  // magic link login API returns
  describe('magicLinkLogin()', () => {
    const magicLinkTestCases = [
      // Case 1: magic link failed due to lack of parameters
      {
        returnUndefined: true,
        params: {
          auth_token: null,
        },
        returnedData: {

        },
        errorMsg: 'magic link failed due to lack of parameters'
      },
      // Case 2: magic link login with API returns
      {
        returnUndefined: false,
        params: {
          auth_token: '$2a$10$opa5v/CB3crj4Bdslm63475h34kjPcrkUmPedOA3SqyFhqHkE9YcCViw7ljp7m',
        },
        returnedData: {
          data: null
        },
        errorMsg: 'magic link login with API returns'
      }
    ];
    for(let index = 0; index < magicLinkTestCases.length; index++){
      let magicLinkTestCase = magicLinkTestCases[index];
      it(magicLinkTestCase.errorMsg, () => {
        if(magicLinkTestCase.returnUndefined){
          expect(service.magicLinkLogin(magicLinkTestCase.params.auth_token)).toBeUndefined();
        }else {
          let actualReturns = {};
          service.magicLinkLogin(magicLinkTestCase.params).subscribe(
            data => {
              actualReturns = data;
            }
          );
          httpMock.expectOne('api/auths.json').flush(magicLinkTestCase.returnedData);
          expect(actualReturns).toEqual(magicLinkTestCase.returnedData);
        }
      })
    }
  });
})
