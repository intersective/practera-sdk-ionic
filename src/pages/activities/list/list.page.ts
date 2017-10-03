import { Component, Input, OnInit } from '@angular/core';
import {
  ActionSheetController,
  NavController,
  ToastController,
  LoadingController,
  ModalController,
  PopoverController,
  Events
} from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import * as _ from 'lodash';
import { loadingMessages, errMessages } from '../../../app/messages';
// services
import { ActivityService } from '../../../services/activity.service';
import { AssessmentService } from '../../../services/assessment.service';
import { AchievementService } from '../../../services/achievement.service';
import { CacheService } from '../../../shared/cache/cache.service';
import { EventService } from '../../../services/event.service';
import { GameService } from '../../../services/game.service';
import { SubmissionService } from '../../../services/submission.service';
import { TranslationService } from '../../../shared/translation/translation.service';
// pages
import { ActivitiesViewPage } from '../view/activities-view.page';
import { ActivityListPopupPage } from './popup';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { PortfolioPage } from '../portfolio/portfolio.page';
import { ItemsPopupPage } from '../../assessments/popup/items-popup.page';
import { PopoverTextPage } from './popover-text';
import { TabsPage } from '../../../pages/tabs/tabs.page';
import { EventsListPage } from '../../events/list/list.page';
import { RankingsPage } from '../../rankings/list/rankings.page';
import { InstructionPage } from './instruction/instruction.page';
// pipes
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { WindowRef } from '../../../shared/window';

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
    this.tickedIDsArray = [[], [], [], [], [], [],[]];
    this.AverageScore = [0, 0, 0, 0, 0, 0, 4];
    this.userExperiencePoint = 0;
    this.eachActivityScores = [];
    this.totalAverageScore = 0;
    this.findDataStatus = [];
  }
  public hardcode_assessment_id: any = 2134;
  public hardcode_context_id: any = 2532;
  public anyNewItems: any = this.cacheService.getLocal('gotNewItems');
  public newItemsData: any = [];
  public activityIndex: any = 0;
  public activities: any = [];
  public activityIDs: any = [];
  public activityIndexArray: any = [];
  public filteredActivityIDs: any = [];
  public AverageScore: any = [];
  public totalAverageScore: any = 0;
  public eachActivityScores: any = [];
  public finalAverageScoreShow: any = '0';
  public findSubmissions: any = [];
  public button_show: boolean = true;
  public portfolio_request: boolean = false;
  public view_portfolio: boolean = false;
  public bookedEventsCount: number = 0;
  public eventsData: any = [];
  public initialItems: any = [];
  public totalAchievements: any = [];
  public currentPoints: number = 0;
  public maxPoints: number = 0;
  public currentPercentage: any = '0';
  public filteredSubmissions: any = [];
  public findDataStatus: any = [];
  public characterData: any = [];
  public submissionData: any = [];
  public sameFontSize: boolean = false;
  public userExperiencePoint: any = 0;
  public characterCurrentExperience: any = '0';
  public percentageValue: number = 0;
  public submissionPoints: number = 0;
  public returnError: boolean = false;
  public rankingsPage = RankingsPage;
  public eventsListPage = EventsListPage;
  public program_id: any = this.cacheService.getLocal('program_id') || "1";
  public email: any = this.cacheService.getLocal('email') || "test@test.com";
  public viewPortfolioLink: any = `https://practera.com/assess/assessments/portfolio/${this.program_id}/${this.email}`;
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
    [355, 356, 353, 354],
    [351, 352, 349, 350],
    [370, 371, 368, 369],
    [344, 345, 342, 343],
    [361, 362, 359, 360],
    [365, 366, 363, 364],
    [341, 341, 341, 341]
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
  public tickedIDsArray: any = [];
  public userAchievementsIDs: any = [];
  public checkUserPointer: boolean = false;
  constructor(
    public navCtrl: NavController,
    public http: Http,
    public activityService: ActivityService,
    public assessmentService: AssessmentService,
    public achievementService: AchievementService,
    public cacheService: CacheService,
    public eventService: EventService,
    public eventListener: Events,
    public gameService: GameService,
    public submissionService: SubmissionService,
    private actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public translationService: TranslationService,
    public win: WindowRef
  ) {
    if(this.email){
      this.cacheService.getLocal('email').replace(/\"/g, "");
    }
    this.anyNewItems = this.cacheService.getLocal('gotNewItems');
    this.newItemsData = this.cacheService.getLocalObject('allNewItems');
  }
  ngOnInit() {}
  ionViewWillEnter(){
    if(this.anyNewItems == 'true') {
      for(let i = 0; i < 5; i++){
        document.querySelector('a.tab-button').className = "hide-tabbar";
      }
    }
    // reset data to 0 when page reloaded before got new data
    this.initilized_varible();
    this.loadingDashboard();
  }
  refreshPage() {
    this.initilized_varible();
    this.loadingDashboard();
  }
  openEvent() {
    // Move to event page
    this.navCtrl.parent.select(1); // go to event tab page
  }
  openLeaderboard() {
    // Move to leaderboard page
    this.navCtrl.parent.select(2); // go to leaderboard tab page
  }
  openPortfolio() {
    // Move to portfolio page
    if (this.view_portfolio) {
      // go/open url in window viewPortfolioLink
      // @TODO: open url in new window isn't supported in PWA mode, this happen to be same behavior for opening link through <a> (anchor element) too!
      let win = this.win.nativeWindow;
      let openedWindow = win.open(this.viewPortfolioLink, '_blank');
    } else {
      if (this.portfolio_request) {
        this.requestPortfolio();
      } else {
        this.whatsThis();
      }
    }
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
            if(this.activities.length == 1 && document.cookie == ""){
              document.cookie = "visitStatus=true; expires=Fri, 31 Dec 9999 23:59:59 GMT";
              this.navCtrl.push(InstructionPage);
            }
            _.forEach(this.activities, ((element,index) => {
              this.activityIndex = index + 1;
              let indeObj = {indexID: this.activityIndex};
              this.activities[index].Activity = _.extend({}, this.activities[index].Activity, indeObj);
              this.activityIDs.push(this.activities[index].Activity.id);
            }));
            // this.activityIDs = this.activityIDs.toString();
            let gameId = this.cacheService.getLocalObject('game_id');
            let getCharacter = this.gameService.getCharacters(gameId);
            let getSubmission = this.submissionService.getSubmissionsData();
            let getUserAchievemnt = this.achievementService.getAchievements();
            let getUserEvents = this.eventService.getUserEvents(this.activityIDs);
            Observable.forkJoin([getSubmission, getCharacter, getUserAchievemnt, getUserEvents])
              .subscribe(results => { // save API request results as a single integrated object 
                loadingData.dismiss().then(() => {
                  // Now only support 1 character in a game
                  this.characterData = results[1].Characters[0];
                  this.cacheService.setLocalObject('character', this.characterData);
                  this.cacheService.setLocal('character_id', this.characterData.id);
                  // display user experience points
                  this.showUserExperience(this.characterData.experience_points);
                  // achievement list data handling
                  this.getUserAchievementData = results[2];
                  _.forEach(this.getUserAchievementData.Achievement, (ele, index) => {
                    this.userAchievementsIDs[index] = ele.id;
                  });
                  // find ahievement ID whether inside achievemnt list or not
                  this.changeColor = this.isTicked(this.userAchievementsIDs, this.achievementListIDs);
                  // find all 4 boxes are ticked index value inside changeColor array
                  _.forEach(this.changeColor, (ele, index) => {
                    let findTrueIndex: any = _.uniq(ele, 'true');
                    if(findTrueIndex[0] == true && findTrueIndex.length == 1){
                      this.activityIndexArray.push(index);
                    }
                  });
                  // submission data handling
                  let findPostProgramAssessmentSubmission: any = [];
                  this.submissionData = results[0];
                  _.forEach(this.submissionData, (element, index) => {
                    if(element.Assessment.id == this.hardcode_assessment_id){ // hardcode for post program assessment_id
                      this.findDataStatus = element.AssessmentSubmission.status;
                    }
                  });
                  if(this.findDataStatus != "done"){
                    this.view_portfolio = false;
                  }else {
                    this.view_portfolio = true;
                  }
                  // match founded array index to activityIDs array and find each of activity IDs
                  for(let index = 0; index < this.activityIndexArray.length; index++) {
                    this.filteredActivityIDs.push(this.activityIDs[this.activityIndexArray[index]]);
                  };
                  // find submission based on founded activity IDs
                  this.displayAverageScore(this.filteredActivityIDs,
                    this.submissionData,
                    this.findSubmissions,
                    this.show_score_act,
                    this.activityIndexArray,
                    this.AverageScore);
                  // get items API call
                  this.gameService.getItems({
                    character_id: this.characterData.id
                  }).subscribe(
                    data => {
                      this.initialItems = data.Items;
                      this.cacheService.setLocalObject('initialItems', this.initialItems);
                      // dispatch event
                      this.eventListener.publish('spinner:update', data);
                    },
                    err => {
                      console.log("Items Data error: ", err);
                    }
                  );
                  this.eventsData = results[3];
                  if (this.eventsData){
                    _.forEach(this.eventsData, (element, index) => {
                      if(this.eventsData[index].isBooked == true && moment().isBefore(moment(this.eventsData[index].end))){
                        this.bookedEventsCount++;
                      }
                    });
                  } else {
                    this.bookedEventsCount = 0;
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
      activityIDs: this.activityIDs,
      tickArray: this.changeColor,
      eachFinalScore: this.eachActivityScores.slice(0, 7),
      newTickIDsArray: this.achievementListIDs,
      portfolioView: this.view_portfolio
    });
  }
  // view the disabled activity popup
  goToPopup(unlock_id: any){
    let disabledActivityPopup = this.modalCtrl.create(ActivityListPopupPage, {unlock_id: unlock_id});
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
  requestPortfolio(){ // request protfolio link action sheet box display functionality
    let processLoading = this.loadingCtrl.create({
      content: 'loading ..'
    });
    let requestPortfolioPopup = this.actionSheetCtrl.create({
      title: `Please note, that once you have requested the digital portfolio your grade can not be changed by doing more submissions. It will be final.`,
      buttons:[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Confirm',
          role: 'OK',
          handler: () => {
            let refs = {
              References: [{
                Assessment: {
                  id: this.hardcode_assessment_id,
                  name: "Personal Edge pre-program questionnaire"
                },
                context_id: this.hardcode_context_id // hardcode for context_id
              }],
              assessment: {
                context_id: this.hardcode_context_id // hardcode for context_id
              }
            };

            this.navCtrl.push(AssessmentsPage, {
              activity: refs
            });
          }
        },
      ]
    });
    requestPortfolioPopup.present();
  }
  showUserExperience(experience_points){
    this.userExperiencePoint = experience_points;
    if(this.userExperiencePoint >= 10000){
      this.sameFontSize = true;
    }else {
      this.sameFontSize = false;
    }
    this.characterCurrentExperience = experience_points;
    if(experience_points >= 100000){
      this.characterCurrentExperience = (experience_points/1000).toFixed(1)+'K';
    }
    if(experience_points >= 1000000){
      this.characterCurrentExperience = (experience_points/1000000).toFixed(1)+'M';
    }
    if(experience_points == 0) {
      this.characterCurrentExperience = '0';
    }
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
      if(activityIndexArray[j] == 6){
        AverageScore[activityIndexArray[j]] = 4;
      }
      if(activityIndexArray[j] <= 5){ // add up together about each acitity average score
        this.totalAverageScore += AverageScore[activityIndexArray[j]];
      }
    }
    this.totalAverageScore = this.totalAverageScore/6;
    this.finalAverageScoreShow = this.totalAverageScore.toFixed(2);
    //check if all activity's score has been displayed
    if(show_score_act.includes(false)){
      this.button_show = true;
    }else {
      this.button_show = false;
    }
    if(this.button_show == false){
      this.portfolio_request = true;
    }else {
      this.portfolio_request = false;
    }
    _.forEach(show_score_act, (ele, index=6) => {
      if(ele == false){
        this.eachActivityScores[index] = -1;
      }else {
        this.eachActivityScores[index] = AverageScore[index];
      }
      this.eachActivityScores.push(this.eachActivityScores[index]);
    });
  }
}
