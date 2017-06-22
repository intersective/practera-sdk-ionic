import { Component, Injectable } from '@angular/core';
import { ViewController, ToastController, LoadingController, NavParams } from 'ionic-angular';
// services
import { AchievementService } from '../../../services/achievement.service';
@Injectable()
@Component({
  selector: 'activity-list-popup',
  templateUrl: 'popup.html' 
})
export class ActivityListPopupPage {
  public unlock_id: any;
  public achievementData: any;
  public badgeUrl: string;
  public description: string;
  public points: string;
  constructor(private viewCtrl: ViewController,
              private navParams: NavParams,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private achievementService: AchievementService){
                this.unlock_id = this.navParams.get('unlock_id');
                console.log('Unlock id value: ', this.unlock_id);
              }
  ionViewWillEnter(){
    let loader = this.loadingCtrl.create({
      content: 'Loading ..'
    });
    loader.present().then(() => {
      let loadingFailed = this.toastCtrl.create({
        message: 'Sorry, laoding activity process is failed, please try it again later.',
        duration: 4000,
        position: 'bottom'
      });
      this.achievementService.getAllAchievements()
        .subscribe(
          data => {
            this.achievementData = data.find(res => res.Achievement.id === this.unlock_id).Achievement;
            this.badgeUrl = this.achievementData.badge;
            this.description = this.achievementData.description;
            this.points = this.achievementData.points;
            loader.dismiss().then(() => {
              console.log(this.badgeUrl + ", " + this.description + ", " + this.points);  
            });
          },
          err => {
            loader.dismiss().then(() => {
              console.log('Error of getting achievement data, ', err);
              loadingFailed.present();
            });
          }
        )
    });
  }
  // close disbaled activity popup
  closeModal() {
    this.viewCtrl.dismiss();
  }
}