import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'test-page',
  template: `<ion-nav #testPage [root]="rootPage"></ion-nav>`
})
export class TestDirective {
  rootPage = null;
  @ViewChild('testPage') nav: NavController;

/*  constructor(page: TestStartPage) {
    this.rootPage = page;
  }*/

  goBack() {
    console.log(this.nav);
    this.nav.pop();
  }
}

