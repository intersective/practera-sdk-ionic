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
  public achievementData: any = null;
  public badgeUrl: string;
  public description: string;
  public points: string;
  public achievementName: string;
  public enableData: boolean = null;
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
    let loadingFailed = this.toastCtrl.create({
      message: 'Sorry, laoding achievement process is failed, please try it again later.',
      duration: 4000,
      position: 'bottom'
    });
    let nothingLoaded = this.toastCtrl.create({
      message: 'Sorry, no achievemnts popout, please contact with your system administrator.',
      duration: 4000,
      position: 'bottom'
    });
    loader.present().then(() => {
      this.achievementService.getAllAchievements()
        .subscribe(
          data => {
            if(data.length > 0){
              this.enableData = true;
              this.achievementData = data.find(res => res.Achievement.id === this.unlock_id).Achievement;
              this.achievementName = this.achievementData.name;
              this.badgeUrl = this.achievementData.badge;
              this.description = this.achievementData.description;
              this.points = this.achievementData.points;
              loader.dismiss().then(() => {
                console.log(this.achievementData);
              });
            }else {
              this.enableData = false;
              loader.dismiss().then(() => {  
                nothingLoaded.present();
              });
            }
          },
          err => {
            this.enableData = false;
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