import { Injectable, Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Slides } from 'ionic-angular';
import { ActivitiesListPage } from '../../activities/list/list.page';
@Injectable()
@Component({
  selector: 'tutorial-page',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  @ViewChild(Slides) slides: Slides;
  public indexCounter: number = 0; 
  public hideNextButton: boolean = false;
  constructor(public navCtrl: NavController){}
  goDashbaord() {
    this.navCtrl.setRoot(ActivitiesListPage);
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