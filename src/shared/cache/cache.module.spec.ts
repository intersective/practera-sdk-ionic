import {} from 'jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CacheComponent } from './cache.component';
import { CacheService } from './cache.service';
import { IonicStorageModule } from '@ionic/storage';

describe('Cache read/write test', () => {

  let comp: CacheComponent;
  let fixture: ComponentFixture<CacheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CacheComponent
      ],
      providers: [
        { provide: CacheService, useClass: CacheService }
      ],
      imports: [
        IonicStorageModule.forRoot({
          name: '__app-vault',
          driverOrder: ['localstorage']
        })
      ]
    });

    fixture = TestBed.createComponent(CacheComponent);
    comp = fixture.componentInstance;
  });

  it('write/read single value', async(() => {
    fixture.componentInstance.setLocal('singleValue', 'yes')
    fixture.componentInstance.getLocal('singleValue')
    expect(fixture.componentInstance.getLocal('singleValue')).toEqual('yes');
  }));
});
