import { Component, Input } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'preview',
  templateUrl: './preview.html'
})
export class PreviewComponent {
  @Input() file: any;
  preview: any;

  constructor(
    private navParam: NavParams,
    private viewCtrl: ViewController
  ) {
    this.preview = (this.file) ? this.file : navParam.get('file');
    console.log('preview?::', this.preview);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
