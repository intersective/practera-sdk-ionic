import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../shared/cache/cache.service';

@Component({
  selector: 'readonly',
  template: `<ion-toolbar no-border-top color="warning" class="warning" *ngIf="readonly">
    <p class="text-center" style="font-size:1em;color:white;">
      <strong>Read-only - No submissions possible</strong>
    </p>
    </ion-toolbar>`,
})
export class ReadonlyComponent implements OnInit {
  readonly: boolean = false;

  constructor(
    private cache: CacheService
  ) {}

  ngOnInit() {
    this.readonly = (this.cache.getLocalObject('enrolmentStatus') === 'readonly');
  }

  ionViewDidEnter() {
    this.readonly = (this.cache.getLocalObject('enrolmentStatus') === 'readonly');
  }
}
