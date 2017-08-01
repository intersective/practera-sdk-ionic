import { Component, Input, OnInit } from '@angular/core';
import {
  NavController,
  ToastController,
  LoadingController,
  ModalController,
  AlertController
} from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '../../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../../app/messages';
// services
import { ActivityService } from '../../../services/activity.service';
import { AchievementService } from '../../../services/achievement.service';
// pages
import { ActivitiesViewPage } from '../view/activities-view.page';
import { ActivityListPopupPage } from './popup';
// pipes
import { TruncatePipe } from '../../../pipes/truncate.pipe';

/**
 * @TODO: remove after development is complete
 * flag to tell whether should UI popup toast error message at the bottom
 * @type {Boolean}
 */
const ACTIVATE_TOAST = false;

@Component({
  selector: 'activities-list-page',
  templateUrl: 'list.html'
})
export class ActivitiesListPage implements OnInit {
  public activities = [];
  public totalAchievements: any = [];
  public currentPoints: number = 0;
  public maxPoints: number = 0;
  public pointPercentage: number = 0;
  public percentageValue: any = 0;
  public returnError: boolean = false;
  // public shiftLang: boolean = false;
  // loading & err message variables
  public activitiesLoadingErr: any = errMessages.General.loading.load;
  public activitiesEmptyDataErr: any = errMessages.Activities.activities.empty;

  // Achievements
  private achievements = {
    maxPoint: {},
    obtained: {},
    available: []
  };

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public activityService: ActivityService,
    public achievementService: AchievementService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public translationService: TranslationService,
    public alertCtrl: AlertController
  ) {}

  // shiftLanguageTrial(){
  //   this.shiftLang = !this.shiftLang;
  //   this.translationService.isTranslated(this.shiftLang);
  // }
  ngOnInit() {
    this.loadingAchievements();
  }

  // display user achievemnt statistics score points
  loadingAchievements() {
    let loadingFailed = this.toastCtrl.create({
      message: this.activitiesLoadingErr,
      duration: 4000,
      position: 'bottom'
    });

    Observable.forkJoin([
      this.achievementService.getAchievements(),
      this.achievementService.getAll(),
      this.achievementService.getMaxPoints()
    ]).subscribe(
        results => {
          this.totalAchievements = results;
          this.achievements = {
            obtained: results[0],
            available: results[1],
            maxPoint: results[2],
          };

          console.log(this.totalAchievements);
          console.log("Max Points: ", results[2].max_achievable_points);
          this.maxPoints = results[2].max_achievable_points;
          this.currentPoints = results[0].total_points;
          if (this.currentPoints >= 0 && this.currentPoints <= this.maxPoints) {
            this.percentageValue = (Math.round( ((this.currentPoints / this.maxPoints) * 100) * 10 ) / 10); // The formula to calculate progress percentage
            (this.percentageValue % 1 === 0) ? this.pointPercentage = this.percentageValue : this.pointPercentage = this.percentageValue.toFixed(1); // to keep one decimal place with percentage value
          } else if(this.currentPoints > this.maxPoints) { // if user achievements points larger then maximum point value, then return 100%
            this.pointPercentage = 100;
          } else { // else for unexpected siuations to return as 0 (eg: if maximum point value is 0)
            this.currentPoints = 0;
            this.maxPoints = 0;
            this.pointPercentage = 0;
          }
        },
        err => {
          this.currentPoints = 0;
          this.maxPoints = 0;
          this.pointPercentage = 0;
          if (ACTIVATE_TOAST) {
            loadingFailed.present();
          }
        }
    );
  }

  // loading activity list data
  loadingActivities = () => {
    let loadingActivities = this.loadingCtrl.create({
      content: 'Loading ..'
    });
    let loadingFailed = this.toastCtrl.create({
      message: this.activitiesLoadingErr,
      duration: 4000,
      position: 'bottom'
    });
    loadingActivities.present();
    this.activityService.getList()
      .subscribe(
        data => {
          this.activities = data;
          if(this.activities.length == 0){
            this.returnError = true;
          }
          loadingActivities.dismiss().then(() => {
            console.log("Activities: ", this.activities);
          });
        },
        err => {
          loadingActivities.dismiss().then(() => {
            if (ACTIVATE_TOAST) {
              loadingFailed.present();
            }
          });
        }
      )
  }

  /**
   * @TODO: remove this feature after development near complete
   * Prompt user to skip loading to skip forced long wait of API
   * @param {Function} cb callback if user choose to load API call
   */
  promptSkipLoading(cb: Function) {
    let prompt = this.alertCtrl.create({
      title: "Skip loading?",
      message: "Skip to speed up development (skip waiting).",
      buttons: [
        {
          text: 'Load it',
          handler: data => {
            return cb();
          }
        },
        {
          text: 'Skip',
          handler: data => console.log(data)
        }
      ]
    })
    prompt.present();
  }

  // load activity data
  ionViewWillEnter() {
    this.promptSkipLoading(this.loadingActivities);
  }

  // refresher activities
  doRefresh(e) {
    this.loadingActivities()
    e.complete();
  }

  // redirect to activity detail page
  goToDetail(activity: any, id: any){
    this.navCtrl.push(ActivitiesViewPage, {
      achievements: this.achievements,
      activity: activity
    });
  }

  // view the disabled activity popup
  goToPopup(unlock_id: any){
    let disabledActivityPopup = this.modalCtrl.create(ActivityListPopupPage, {unlock_id: unlock_id});
    console.log("Achievement ID: ", unlock_id);
    disabledActivityPopup.present();
  }
}
