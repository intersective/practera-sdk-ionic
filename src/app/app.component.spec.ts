import { MyApp } from './app.component';

import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

let comp: MyApp;
let fixture: ComponentFixture<MyApp>;

describe('Component: Root Component (MyApp)', () => {
  let component: MyApp;
  let fixture: ComponentFixture<MyApp>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyApp ],
      /*providers: [

      ],
      imports: [
          IonicModule.forRoot(MyApp)
      ]*/
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;
  });

  /*afterEach(() => {
    fixture.destroy();
    component = null;
  });*/

  it('should create component', () => expect(component).toBeDefined());

  it('should be a component', () => {
    expect(component instanceof MyApp).toBe(true);
  });

  it('should has local variables', () => {
    expect(component.rootPage).toBeDefined();
    expect(component.urlParameters).toBeDefined();
  });

  it('is created', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });


  // it('initialises with a root page of HomePage', () => {
  //     expect(comp['rootPage']).toBe(HomePage);
  // });
});
