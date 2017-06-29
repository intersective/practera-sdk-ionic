import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'photo',
  templateUrl: 'photo.html'
})
export class PhotoComponent {
  @Input() photo;

  constructor(
    public navCtrl: NavController
  ) {}

  public gotoPhoto(photoId) {
    alert('AAAAA');
    // this.navCtrl.push();
  }
}
