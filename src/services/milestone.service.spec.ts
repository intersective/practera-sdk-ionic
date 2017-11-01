import {} from 'jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MilestoneTestComponent } from './milestone.test.component';
import { MilestoneService } from './milestone.service';
import { RequestService } from '../shared/request/request.service';
import { CacheService } from '../shared/cache/cache.service';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { RequestModule } from '../shared/request/request.module';

import '../shared/rxjs-operators';

describe('Milestone Service test', () => {

  let comp: MilestoneTestComponent;
  let fixture: ComponentFixture<MilestoneTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MilestoneTestComponent
      ],
      providers: [
        { provide: MilestoneService, useClass: MilestoneService },
        { provide: CacheService, useClass: CacheService },
        { provide: RequestService, useClass: RequestService }
      ],
      imports: [
        IonicStorageModule.forRoot({
          name: '__app-vault',
          driverOrder: ['localstorage']
        }),
        RequestModule.forRoot({
          appKey: '',
          prefixUrl: ''
        }),
        HttpModule
      ]
    });

    fixture = TestBed.createComponent(MilestoneTestComponent);
    comp = fixture.componentInstance;
  });

  it('Test getMilestones()', async(() => {
    fixture.componentInstance.getMilestones()
      .subscribe((res) => {
        console.log('res', res);
      }, (err) => {
        console.log('err', err);
      });
  }));
});
