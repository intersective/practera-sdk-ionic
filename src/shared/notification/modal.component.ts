import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'modal',
  template: `
  <ion-content>
    <ion-navbar>
      <ion-buttons>
        <button ion-button (click)="dismiss()">
          <ion-icon name="close"></ion-icon>
        </button>
      </ion-buttons>
      <ion-title [hidden]="!context.title">{{ context.title }}</ion-title>
    </ion-navbar>
    <div [hidden]="!context.notification_icon">
      <ion-img style="max-width: 150px;" src="{{ context.notification_icon }}"></ion-img>
		</div>

    <p [hidden]="!context.description" [innerHTML]="context.description"></p>
    <div [hidden]="!context.score">{{ context.score }}</div>

    <button [hidden]="!context.button_label" style="margin: 30px 0;"
      (click)="context.button_function()" ion-button block>
      {{ context.button_label }}
    </button>

    <button [hidden]="!context.button_function" style="margin: 30px 0;"
      (click)="context.button_link ? goOtherScreen(context.button_link) : dismiss()" ion-button block>
      {{ context.button_label }}
    </button>
  </ion-content>
  `
})
export class ModalComponent {

  context;

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.context = this.params.get('context');
  }

  ngOnInit() {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  gotoScreen(path) {
    this.dismiss();

    // if ($state.current.name != route || route !== '') {
    //   $state.go(route);
    // }
  }
}
