import { Component, Input, OnInit } from '@angular/core';
import {
  NavController,
  ToastController,
  LoadingController,
  ModalController
} from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '../../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../../app/messages';
import * as _ from 'lodash';
// services
import { ActivityService } from '../../../services/activity.service';
import { AchievementService } from '../../../services/achievement.service';
import { CacheService } from '../../../shared/cache/cache.service';
import { CharacterService } from '../../../services/character.service';
import { GameService } from '../../../services/game.service';
import { SubmissionService } from '../../../services/submission.service';
// pages
import { ActivitiesViewPage } from '../view/activities-view.page';
import { ActivityListPopupPage } from './popup';
import { ItemsPopupPage } from '../../assessments/popup/items-popup.page';
import { TabsPage } from '../../../pages/tabs/tabs.page';
// pipes
import { TruncatePipe } from '../../../pipes/truncate.pipe';
/**
 * @TODO: remove after development is complete
 * flag to tell whether should UI popup toast error message at the bottom
 * @type {Boolean}
 */

@Component({
  selector: 'activities-list-page',
  templateUrl: 'list.html'
})
export class ActivitiesListPage implements OnInit {
  private anyNewItems: any = this.cacheService.getLocal('gotNewItems');
  private newItemsData: any = [];
  private activities: any = [];
  private initialItems: any = [];
  private totalAchievements: any = [];
  private currentPoints: number = 0;
  private maxPoints: number = 0;
  private currentPercentage: any = '0';
  private filteredSubmissions: any = [];
  private characterData: any = [];
  private submissionData: any = [];
  private characterCurrentExperience: number = 0;
  private percentageValue: number = 0;
  private submissionPoints: number = 0;
  private returnError: boolean = false;
  // loading & err message variables
  private activitiesLoadingErr: any = errMessages.General.loading.load;
  private activitiesEmptyDataErr: any = errMessages.Activities.activities.empty;
  // Achievements
  private achievements = {
    maxPoint: {},
    obtained: {},
    available: []
  };
  constructor(
    private navCtrl: NavController,
    private http: Http,
    private activityService: ActivityService,
    private achievementService: AchievementService,
    private cacheService: CacheService,
    private characterService: CharacterService,
    private gameService: GameService,
    private submissionService: SubmissionService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private translationService: TranslationService
  ) {
    this.anyNewItems = this.cacheService.getLocal('gotNewItems');
    this.newItemsData = this.cacheService.getLocalObject('allNewItems');
    console.log("item data: ", this.newItemsData);
  }
  ngOnInit() {
    this.loadingDashboard();
  }
  // refresher activities
  doRefresh(e) {
    this.loadingDashboard();
    e.complete();
  }
  // display user achievemnt statistics score points
  loadingDashboard() {
    let loadingData = this.loadingCtrl.create({
      content: 'Loading ..'
    });
    let loadingFailed = this.toastCtrl.create({
      message: this.activitiesLoadingErr,
      duration: 4000,
      position: 'bottom'
    });
    let getActivities = this.activityService.getList();
    loadingData.present().then(() => {
      getActivities.subscribe(
        results => {
            this.activities = results;
            if(this.activities.length == 0){
              this.returnError = true;
            }
            let getCharacter = this.characterService.getCharacter();
            let getSubmission = this.submissionService.getSubmissionsData();
            Observable.forkJoin([getSubmission, getCharacter])
              .subscribe(results => {
                loadingData.dismiss().then(() => {
                  this.submissionData = results[0];
                  _.forEach(this.submissionData, element => {
                    if(element.AssessmentSubmission.status == 'published' || element.AssessmentSubmission.status == 'done'){
                      if(element.AssessmentSubmission.moderated_score !== null){
                        this.filteredSubmissions.push(element.AssessmentSubmission);
                        this.submissionPoints += parseFloat(element.AssessmentSubmission.moderated_score);
                      }
                    }
                  });
                  let average_score = (this.submissionPoints/this.filteredSubmissions.length)*100;
                  (average_score > 0) ? this.percentageValue = average_score : this.percentageValue = 0;
                  this.currentPercentage = this.percentageValue.toFixed(2);
                  // console.log("Percent: ", this.currentPercentage); // display as string format
                  this.characterData = results[1].Characters[0];
                  this.cacheService.setLocal('character_id', this.characterData.id);
                  console.log("character id: ", this.characterData.id);
                  this.characterCurrentExperience = this.characterData.experience_points;
                  // console.log("Experience: ", this.characterCurrentExperience);
                  this.gameService.getItems({
                    character_id: this.characterData.id
                  })
                  .subscribe(
                    data => {
                      this.initialItems = data.Items;
                      this.cacheService.setLocalObject('initialItems', this.initialItems);
                      console.log("Items Data: ", this.initialItems);
                    },
                    err => {
                      console.log("Items Data error: ", err);
                    }
                  );
                });
              },
              err => {
                loadingData.dismiss().then(() => {
                  loadingFailed.present();
                });
              }
            );
          },
          error => {
            loadingData.dismiss().then(() => {
              loadingFailed.present();
            });
          }
        );
    });
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
  // close modal and display as main page
  closeItemsShwon(){
    this.anyNewItems = !this.cacheService.getLocal('gotNewItems');
    this.cacheService.setLocalObject('allNewItems', []);
    this.cacheService.setLocal('gotNewItems', !this.cacheService.getLocal('gotNewItems'));
    this.navCtrl.setRoot(TabsPage);
  }
}
