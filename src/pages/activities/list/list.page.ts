import { Component, Input, OnInit } from '@angular/core';
import {
  NavController,
  ToastController,
  LoadingController,
  ModalController,
  PopoverController,
  Events
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
import { EventService } from '../../../services/event.service';
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
  public initilized_varible(){
    this.bookedEventsCount = 0;
    this.characterCurrentExperience = 0;
    this.currentPercentage = 0;
    this.activityIDs = [];
    this.activityIndexArray = [];
    this.filteredActivityIDs = [];
    this.findSubmissions = [[], [], [], [], [], [],[]];
    this.AverageScore = [0, 0, 0, 0, 0, 0, 0];
  }
  public anyNewItems: any = this.cacheService.getLocal('gotNewItems');
  public newItemsData: any = [];
  public activityIndex: any = 0;
  public activities: any = [];
  public activityIDs: any = [];
  public activityIndexArray: any = [];
  public filteredActivityIDs: any = [];
  public AverageScore: any = [];
  public totalAverageScore: any = 0;
  public finalAverageScoreShow: any = '0';
  public findSubmissions: any = [];
  public button_show = true;
  public bookedEventsCount: any = 0;
  public eventsData: any = [];
  public initialItems: any = [];
  public totalAchievements: any = [];
  public currentPoints: number = 0;
  public maxPoints: number = 0;
  public currentPercentage: any = '0';
  public filteredSubmissions: any = [];
  public characterData: any = [];
  public submissionData: any = [];
  public characterCurrentExperience: any = '0';
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
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [317, 318, 319, 320],
    [321, 323, 322, 324],
    [0, 0, 0, 0],
    [316, 316, 316, 316]
  ];
  public show_score_act: any = [
    false,false,false,false,false,false,false
  ];
  public getUserAchievementData: any = [];
  public changeColor: any = [
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false],
    [false,false,false,false]
  ];
  public userAchievementsIDs: any = [];
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public activityService: ActivityService,
    public achievementService: AchievementService,
    public cacheService: CacheService,
    public characterService: CharacterService,
    public eventService: EventService,
    public eventListener: Events,
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
    // this.loadingDashboard();
  }
  ionViewWillEnter(){
    // reset data to 0 when page reloaded before got new data
    this.bookedEventsCount = 0;
    this.characterCurrentExperience = 0;
    this.currentPercentage = 0;

    // replicated this.doRefresh
    this.initilized_varible();
    this.loadingDashboard();
  }

  openEvent() {
    // Move to event page
    this.navCtrl.parent.select(1);
  }

  // refresher activities
  doRefresh(e) {
    this.initilized_varible();
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
            // get activities data
            this.activities = results;
            if(this.activities.length == 0){
              this.returnError = true;
            }
            _.forEach(this.activities, ((element,index) => {
              this.activityIndex = index + 1;
              let indeObj = {indexID: this.activityIndex};
              this.activities[index].Activity = _.extend({}, this.activities[index].Activity, indeObj);
              this.activityIDs.push(this.activities[index].Activity.id);
            }));
            console.log("this.activityIDs: ", this.activityIDs);
            // this.activityIDs = this.activityIDs.toString();
            let getCharacter = this.characterService.getCharacter();
            let getSubmission = this.submissionService.getSubmissionsData();
            let getUserAchievemnt = this.achievementService.getAchievements();
            let getUserEvents = this.eventService.getUserEvents(this.activityIDs);
            Observable.forkJoin([getSubmission, getCharacter, getUserAchievemnt, getUserEvents])
              .subscribe(results => {
                loadingData.dismiss().then(() => {
                  this.characterData = results[1].Characters[0];
                  this.cacheService.setLocalObject('character', this.characterData);
                  this.cacheService.setLocal('character_id', this.characterData.id);
                  // console.log("character id: ", this.characterData.id);
                  this.characterCurrentExperience = this.characterData.experience_points;
                  if(this.characterData.experience_points == 0) {
                    this.characterCurrentExperience = '0';
                  }
                  // achievement list data handling
                  this.getUserAchievementData = results[2];
                  // console.log("this.getUserAchievementData: ", this.getUserAchievementData);
                  _.forEach(this.getUserAchievementData.Achievement, (ele, index) => {
                    this.userAchievementsIDs[index] = ele.id;
                    // console.log("ID value: ", this.userAchievemntsIDs[index]);
                  });
                  // find ahievement ID whether inside achievemnt list or not
                  this.changeColor = this.isTicked(this.userAchievementsIDs, this.achievementListIDs);
                  // console.log("change color: array: ", this.changeColor);
                  // find all 4 boxes are ticked index value inside changeColor array
                  _.forEach(this.changeColor, (ele, index) => {
                    let findTrueIndex: any = _.uniq(ele, 'true');
                    console.log("findTrueIndex: ", findTrueIndex);
                    if(findTrueIndex[0] == true && findTrueIndex.length == 1){
                      this.activityIndexArray.push(index);
                    }
                  });
                  // submission data handling
                  this.submissionData = results[0];
                  // console.log("Indexes:", this.activityIndexArray);
                  // match founded array index to activityIDs array and find each of activity IDs
                  for(let index = 0; index < this.activityIndexArray.length; index++) {
                    this.filteredActivityIDs.push(this.activityIDs[this.activityIndexArray[index]]);
                  };
                  // console.log("filteredActivityIDs: ", this.filteredActivityIDs);
                  // find submission based on founded activity IDs
                  this.displayAverageScore(this.filteredActivityIDs, this.submissionData, this.findSubmissions, this.show_score_act, this.activityIndexArray, this.AverageScore);
                  // get items API call
                  this.gameService.getItems({
                    character_id: this.characterData.id
                  }).subscribe(
                    data => {
                      this.initialItems = data.Items;
                      this.cacheService.setLocalObject('initialItems', this.initialItems);
                      // dispatch event
                      this.eventListener.publish('spinner:update', data);
                      // console.log("Items Data: ", this.initialItems);
                    },
                    err => {
                      console.log("Items Data error: ", err);
                    }
                  );
                  this.eventsData = results[3];
                  if(this.eventsData){
                    _.forEach(this.eventsData, (element, index) => {
                      if(this.eventsData[index].isBooked == true){
                        this.bookedEventsCount++;
                      }
                    });
                    if(this.bookedEventsCount == 0){
                      this.bookedEventsCount = 'None';
                    }
                  }else {
                    this.bookedEventsCount = 'None';
                  }
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
  goToDetail(activity: any){
    this.navCtrl.push(ActivitiesViewPage, {
      achievements: this.achievements,
      activity: activity,
      activityIDs: this.activityIDs
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
  isTicked(userAchievementIDs, hardcodedAchievements){
    let tick = this.changeColor;
    for(let i = 0; i < 7; i++){
      for(let j = 0; j < 4; j++){
        if(userAchievementIDs.includes(hardcodedAchievements[i][j])){
          tick[i][j] = true;
        }else {
          tick[i][j] = false;
        }
      }
    }
    return tick;
  }
  displayAverageScore(filteredActivityIDs, submissionData, findSubmissions, show_score_act, activityIndexArray, AverageScore){
    for(let j = 0; j < filteredActivityIDs.length; j++){
      for(let i = 0; i < submissionData.length; i++){
        if(submissionData[i].AssessmentSubmission.activity_id == filteredActivityIDs[j] && submissionData[i].AssessmentSubmission.status == 'published'){
          findSubmissions[j].push(parseFloat(submissionData[i].AssessmentSubmission.moderated_score));
        }
      }
      findSubmissions[j].sort();
      findSubmissions[j].reverse();
      show_score_act[activityIndexArray[j]] = true;
      if(findSubmissions[j].length > 1){
        AverageScore[activityIndexArray[j]] = (findSubmissions[j][0]+findSubmissions[j][1])*2;
      }else if(findSubmissions[j].length == 1) {
        AverageScore[activityIndexArray[j]] = findSubmissions[j][0] * 4;
      }
      // console.log("average score: ", AverageScore);
      this.totalAverageScore += AverageScore[activityIndexArray[j]];
    }
    this.totalAverageScore = this.totalAverageScore/6;
    this.finalAverageScoreShow = this.totalAverageScore.toFixed(2);
    // console.log("totalAverageScore: ", this.totalAverageScore);
    //check if all activity's score has been displayed
    if(show_score_act.includes(false)){
      this.button_show = true;
    }else {
      this.button_show = false;
    }
  }
}
