import { Injectable, Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides } from 'ionic-angular';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser';
// pages
import { SettingsPage } from '../settings.page';
@Injectable()
@Component({
  selector: 'tutorial-page',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  videoUrl: SafeResourceUrl;
  @ViewChild(Slides) slides: Slides;
  public indexCounter: number = 0;
  public hideNextButton: boolean = false;
  constructor(public navCtrl: NavController,
              public domSanitizer: DomSanitizer){
                this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl("https://player.vimeo.com/external/237666876.sd.mp4?s=18ab86bd2bce8ad3385f2cca6c66bfccfd955539&profile_id=164");
              }
  goDashbaord() {
    // Back to settings
    // this.navCtrl.setRoot(SettingsPage);
    this.navCtrl.pop();
  }
  goPrev() {
    this.slides.slidePrev();
    this.hideNextButton = false;
  }
  goNext() {
    this.slides.slideNext();
    this.slides.isEnd() == true ? this.hideNextButton = true : this.hideNextButton = false;
  }
}
