import {} from 'jasmine';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CacheModule } from '../shared/cache/cache.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MilestoneComponentTest } from './milestone.component.test';
import { MilestoneService } from '../services/milestone.service';
import { RequestModule } from '../shared/request/request.module';
import { default as Configure } from '../configs/config';

// import '../shared/rxjs-operators';

// import { AppModule } from '../app/app.module';

describe('Milestone Service test', () => {

  let comp: MilestoneComponentTest;
  let fixture: ComponentFixture<MilestoneComponentTest>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MilestoneComponentTest
      ],
      imports: [
        CacheModule,
        HttpClientModule,
        RequestModule.forRoot({
          appKey: Configure.appKey,
          prefixUrl: Configure.prefixUrl
        })
      ],
      providers: [
        { provide: MilestoneService, useClass: MilestoneService }
      ]
    });

    fixture = TestBed.createComponent(MilestoneComponentTest);
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
