import { Component, Input } from '@angular/core';

const iconColors = [
  'icon-color-6',
  'icon-color-4',
  'icon-color-1',
  'icon-color-2',
  'icon-color-0',
  'icon-color-3',
  'icon-color-5'
];

@Component({
  selector: 'rainbow-icons',
  template: `<p>
    <span *ngIf="index == 0">
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-6': colors[0], 'fa-circle-thin': !colors[0] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-6': colors[1], 'fa-circle-thin': !colors[1] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-6': colors[2], 'fa-circle-thin': !colors[2] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-6': colors[3], 'fa-circle-thin': !colors[3] }" aria-hidden="true"></i>
    </span>

    <span *ngIf="index == 1">
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-4': colors[0], 'fa-circle-thin': !colors[0] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-4': colors[1], 'fa-circle-thin': !colors[1] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-4': colors[2], 'fa-circle-thin': !colors[2] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-4': colors[3], 'fa-circle-thin': !colors[3] }" aria-hidden="true"></i>
    </span>

    <span *ngIf="index == 2">
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-1': colors[0], 'fa-circle-thin': !colors[0] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-1': colors[1], 'fa-circle-thin': !colors[1] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-1': colors[2], 'fa-circle-thin': !colors[2] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-1': colors[3], 'fa-circle-thin': !colors[3] }" aria-hidden="true"></i>
    </span>

    <span *ngIf="index == 3">
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-2': colors[0], 'fa-circle-thin': !colors[0] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-2': colors[1], 'fa-circle-thin': !colors[1] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-2': colors[2], 'fa-circle-thin': !colors[2] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-2': colors[3], 'fa-circle-thin': !colors[3] }" aria-hidden="true"></i>
    </span>

    <span *ngIf="index == 4">
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-0': colors[0], 'fa-circle-thin': !colors[0] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-0': colors[1], 'fa-circle-thin': !colors[1] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-0': colors[2], 'fa-circle-thin': !colors[2] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-0': colors[3], 'fa-circle-thin': !colors[3] }" aria-hidden="true"></i>
    </span>

    <span *ngIf="index == 5">
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-3': colors[0], 'fa-circle-thin': !colors[0] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-3': colors[1], 'fa-circle-thin': !colors[1] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-3': colors[2], 'fa-circle-thin': !colors[2] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-3': colors[3], 'fa-circle-thin': !colors[3] }" aria-hidden="true"></i>
    </span>

    <span *ngIf="index == 6">
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-5': colors[0], 'fa-circle-thin': !colors[0] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-5': colors[1], 'fa-circle-thin': !colors[1] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-5': colors[2], 'fa-circle-thin': !colors[2] }" aria-hidden="true"></i>
      <i class="fa icon-color-default" [ngClass]="{'fa-check-circle-o icon-color-5': colors[3], 'fa-circle-thin': !colors[3] }" aria-hidden="true"></i>
    </span>
  </p>`
})

export class RainbowIconsComponent {
  @Input('styling') index: number;
  @Input('colorings') colors: Array<any>;

}
