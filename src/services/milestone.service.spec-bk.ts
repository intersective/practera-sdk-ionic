
import { TestBed, inject, async } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { Http } from '@angular/http';

import {} from 'jasmine';

// import { MyApp } from '../app/app.component';
import { CacheService } from '../shared/cache/cache.service';
import { RequestService } from '../shared/request/request.service';
import { MilestoneService } from './milestone.service';
import { Storage } from '@ionic/storage';
// import { MilestoneServiceMock } from './milestone.service.mock';

// let milestone: MilestoneService = null;

describe('MilestoneService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],

      providers: [
          // {
          //     provide: MilestoneService,
          //     useClass: MilestoneServiceMock
          // }
          CacheService,
          RequestService,
          MilestoneService,
          Storage
      ],

      imports: []

    }).compileComponents();
  }));

  it('test 1', inject([ MilestoneService ], (milestoneService) => {
    console.log('>>', milestoneService);
  }));
});
