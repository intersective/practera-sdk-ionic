import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
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
  public currentPoints: number = 0;
  public totalPoints: number = 0;
  public pointPercentage: number = 0;
  public totalAchievements: any = [];
  constructor(
    public navCtrl: NavController,
    public activityService: ActivityService,
    public achievementService: AchievementService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController
  ) {}
  ngOnInit(){
    this.loadingAchievements();
  }
  // display user achievemnt statistics score points 
  loadingAchievements(){
    let loadingFailed = this.toastCtrl.create({
      message: 'Sorry, laoding activity process is failed, please try it again later.',
      duration: 4000,
      position: 'bottom'
    });
    let getUserAchievements = this.achievementService.getAchievements();
    let getAllAchievements = this.achievementService.getAllAchievements();
    Observable.forkJoin([getUserAchievements, getAllAchievements])
              .subscribe(results => {
                this.totalAchievements = results;
                this.currentPoints = results[0].total_points;
                for(let index = 0; index < results[1].length; index++){
                  this.totalPoints += results[1][index].Achievement.points;
                }
                this.pointPercentage = (this.currentPoints / this.totalPoints) * 100;
                console.log('Current Points1: ' + this.currentPoints + ' Total Points1: ' + this.totalPoints);
              },
              err => {
                this.currentPoints = 0;
                this.totalPoints = 0;
                this.pointPercentage = 0;
                loadingFailed.present();
              }
    );
  }
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
  // load activity data
  ionViewWillEnter() {
    this.loadingActivities();
  }
  // refresher activities
  doRefresh(e) {
    this.loadingActivities()
    e.complete();  
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
