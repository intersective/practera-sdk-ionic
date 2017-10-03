import { CacheComponent } from './cache.component';
import { CacheService } from './cache.service';
import { IonicStorageModule } from '@ionic/storage';

import { async, TestBed } from '@angular/core/testing';

describe('Cache read/write test', () => {

  let fixture;

  beforeAll(() => {
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
        }),
      ]
    });
    fixture = TestBed.createComponent(CacheComponent);
    fixture.detectChanges();
  });

  it('write/read single value', async(() => {
    fixture.componentInstance.save('singleValue', 'yes')
    .then((saved) => {
      fixture.componentInstance.load('singleValue')
      .then((content) => {
        expect(content).toEqual('yes');
      });
    });
  }));

  it('write/read multi-level value', async(() => {
    fixture.componentInstance.save('multiLevels.one', 'yes')
    .then((saved) => {
      fixture.componentInstance.load('multiLevels.one')
      .then((content) => {
        expect(content).toEqual('yes');
      });
    });
  }));

  it('Write in parallel', async(() => {
    fixture.componentInstance.save('paralle.writeOne', 'one');
    fixture.componentInstance.save('paralle.writeTwo', 'two');

    fixture.componentInstance.load('paralle')
    .then((content) => {
      expect(content).toEqual({
        writeOne: 'one',
        writeTwo: 'two'
      });
    });
  }));
});
