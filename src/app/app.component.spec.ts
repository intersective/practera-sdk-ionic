import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
// sub pages
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { TabsPage } from '../pages/tabs/tabs.page';
import { RegisterPage } from '../pages/registration/register.page';
import { LoginPage } from '../pages/login/login';
import { MagicLinkPage } from '../pages/magic-link/magic-link';
import { TestPage } from '../pages/tabs/test.page';

// shared module
import { NotificationModule } from '../shared/notification/notification.module';

// services
import {
  AuthService,
  ActivityService
} from '../services';
import {
  RequestModule,
  CacheModule
} from '../shared';

let fixture: ComponentFixture<MyApp>;
let component: MyApp;

describe('MyApp Component', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp,

      ],
      imports: [
        IonicModule.forRoot(MyApp),
        NotificationModule,
        RequestModule,
        CacheModule
      ],
      providers: [
        AuthService
      ]
    })
    // .overrideModule()
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(MyApp);
      component = fixture.componentInstance;
    });

  }));

  it ('should be created', () => {
    expect(component instanceof MyApp).toBe(true);
  });

  it ('should have empty rootPage', () => {
    expect(component.rootPage).toBeUndefined();
  });

  it ('should have 5 default supported urls params', () => {
    const supportedParams = {
      'registration': RegisterPage,
      'login': LoginPage,
      'resetpassword': ResetPasswordPage,
      'secure': MagicLinkPage,
      'test': TestPage
    };
    console.log(component.do);

    expect(component.do.registration).toBe(RegisterPage);
    expect(component.do.login).toBe(supportedParams.login);
    expect(component.do.resetpassword).toBe(supportedParams.resetpassword);
    expect(component.do.secure).toBe(supportedParams.secure);
    expect(component.do.test).toBe(supportedParams.test);
  });

});
