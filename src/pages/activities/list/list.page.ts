import { Component, Input, OnInit } from '@angular/core';
import {
  NavController,
  ToastController,
  LoadingController,
  ModalController,
  PopoverController
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
import { PopoverTextPage } from './popover-text';
import { TabsPage } from '../../../pages/tabs/tabs.page';
import { EventsListPage } from '../../events/list/list.page';
import { RankingsPage } from '../../rankings/list/rankings.page';
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
  public anyNewItems: any = this.cacheService.getLocal('gotNewItems');
  public newItemsData: any = [];
  public activities: any = [];
  public initialItems: any = [];
  public totalAchievements: any = [];
  public currentPoints: number = 0;
  public maxPoints: number = 0;
  public currentPercentage: any = '0';
  public filteredSubmissions: any = [];
  public characterData: any = [];
  public submissionData: any = [];
  public characterCurrentExperience: number = 0;
  public percentageValue: number = 0;
  public submissionPoints: number = 0;
  public returnError: boolean = false;
  public rankingsPage = RankingsPage;
  public eventsListPage = EventsListPage;
  // loading & err message variables
  public activitiesLoadingErr: any = errMessages.General.loading.load;
  public activitiesEmptyDataErr: any = errMessages.Activities.activities.empty;
  // Achievements
  private achievements = {
    maxPoint: {},
    obtained: {},
    available: []
  };
  public achievementListIDs: any = [
    [317, 318, 319, 320],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [321, 323, 322, 324],
    [0, 0, 0, 0]
  ];
  public getUserAchievementData: any = [];
  public changeColor: any = [
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false]
  ];
  // public userAchievemntsIDsObj: any = {};
  public userAchievemntsIDs: any = [];
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public activityService: ActivityService,
    public achievementService: AchievementService,
    public cacheService: CacheService,
    public characterService: CharacterService,
    public gameService: GameService,
    public submissionService: SubmissionService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public translationService: TranslationService
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
            let getUserAchievemnt = this.achievementService.getAchievements();
            Observable.forkJoin([getSubmission, getCharacter, getUserAchievemnt])
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
                  let average_score = (this.submissionPoints/this.filteredSubmissions.length)*4; // calculate GPA garde
                  (average_score > 0) ? this.percentageValue = average_score : this.percentageValue = 0;
                  this.currentPercentage = this.percentageValue.toFixed(2);
                  // console.log("Percent: ", this.currentPercentage); // display as string format
                  this.characterData = results[1].Characters[0];
                  this.cacheService.setLocal('character_id', this.characterData.id);
                  console.log("character id: ", this.characterData.id);
                  this.characterCurrentExperience = this.characterData.experience_points;
                  // console.log("Experience: ", this.characterCurrentExperience);
                  // achievement list data handling 
                  this.getUserAchievementData = results[2];
                  console.log("this.getUserAchievementData: ", this.getUserAchievementData);
                  _.forEach(this.getUserAchievementData.Achievement, (ele, index) => {
                    this.userAchievemntsIDs[index] = ele.id;
                    console.log("ID value: ", this.userAchievemntsIDs[index]);
                  });
                  // find ahievement ID whether inside achievemnt list or not
                  for(let i=0; i<6; i++){
                    for(let j=0; j<4; j++){
                      if(this.userAchievemntsIDs.includes(this.achievementListIDs[i][j])){
                        this.changeColor[i][j] = true;
                      }else {
                        this.changeColor[i][j] = false;
                      }
                    }
                  }
                  this.gameService.getGameItems(this.characterData.id)
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
  // link to certain pages
  whatsThis() {
    let popover = this.popoverCtrl.create(PopoverTextPage);
    popover.present();
  }
}
