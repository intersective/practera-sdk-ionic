/**
 * Instructions:
 * To use this test module, insert "my-test" attribute to your HTML tag.
 * It'll generate a full Ionic Page,
 * so it's recommended to include it only if you need it as single full page/component.
 */

import { ModuleWithProviders, NgModule, SkipSelf, Optional } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CommonModule} from '@angular/common';
import { TestPage } from './pages/test/test.page';
import { TestStartPage } from './pages/test/test-start.page';
import { TestDirective } from './test.directive';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [
    TestPage,
    TestStartPage,
    TestDirective,
  ],
  exports: [
    TestPage,
    TestStartPage,
    TestDirective,
    CommonModule,
    IonicModule
  ]
})

export class TestModule {
}
