import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, ModalController } from 'ionic-angular';
// services
import { ActivityService } from '../../../services/activity.service';
import { AchievementService } from '../../../services/achievement.service';
// components
import { ActivityComponent } from '../../../components/activity/activity.component';
// pages
import { ActivitiesViewPage } from '../view/view.page';
import { ActivityListPopupPage } from './popup';
// pipes
import { TruncatePipe } from '../../../pipes/truncate.pipe';
@Component({
  selector: 'activities-list-page',
  templateUrl: 'list.html'
})
export class ActivitiesListPage implements OnInit {
  public activities = [];
  public totalPoint: number;
  public nextProgramPoint: number;
  public pointPercentage: number;

  public achievementData: any;
  public badgeUrl: string;
  public description: string;
  public points: string;
  public unlock_id: any;

  constructor(
    public navCtrl: NavController,
    public activityService: ActivityService,
    public achievementService: AchievementService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {}
  // loading activity list data
  loadingActivities(){
    let loadingActivities = this.loadingCtrl.create({
      content: 'Loading ..'
    });
    let loadingFailed = this.toastCtrl.create({
      message: 'Sorry, laoding activity process is failed, please try it again later.',
      duration: 4000,
      position: 'bottom'
    });
    loadingActivities.present();
    this.activityService.getActivities()
        .subscribe( 
          data => {
            this.activities = data;
            loadingActivities.dismiss().then(() => {
              console.log("Activities: ", this.activities);
            });
          },
          err => {
            loadingActivities.dismiss().then(() => {
              console.log('Error of getting activity data, ', err);
              loadingFailed.present();
            });
          }
        )
  }
  // get activities list data
  ngOnInit(){
    // this.loadingActivities();
    // display user achievemnt score points 
    this.achievementService.getAllAchievements()
        .subscribe(
          data => {
            console.log("User Total Achievement, ", data);
          },
          err => {
            console.log(err);
          }
        )
  }
  // load data
  ionViewDidEnter() {
    this.loadingActivities();
  }
  // refresher 
  doRefresh(e) {
    this.loadingActivities();
  }

  // redirect to activity detail page
  goToDetail(activity: any, id: any){
    this.navCtrl.push(ActivitiesViewPage, { activity: activity, id: id });
  }
  // view the disabled activity popup
  goToPopup(unlock_id: any){
    let disabledActivityPopup = this.modalCtrl.create(ActivityListPopupPage, {unlock_id: unlock_id});
    console.log("Achievement ID: ", unlock_id);
    disabledActivityPopup.present();
  }
}
