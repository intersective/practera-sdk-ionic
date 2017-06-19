import { Component, ViewChild } from '@angular/core';
// import { TestStartPage } from './test-start.page';

@Component({
  selector: 'full-test',
  template: `<ion-header>
    <ion-navbar>
      <ion-title>Test page</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>
    <test-page #something></test-page>
  </ion-content>`
})
export class TestPage {
  @ViewChild('something') nav;
/*  constructor(page: TestStartPage) {
    this.rootPage = page;
  }*/

  something() {
    console.log(this.nav);
  }
}

