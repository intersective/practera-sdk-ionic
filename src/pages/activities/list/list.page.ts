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
  public activities: any = [];
  public currentPercentage: any = 0;
  public characterData: any = [];
  public submissionData: any = [];
  public characterCurrentExperience: number = 0;
  public percentageValue: number = 0;
  public submissionPoints: number = 0;
  public returnError: boolean = false;
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
    public cacheService: CacheService,
    public characterService: CharacterService,
    public gameService: GameService,
    public submissionService: SubmissionService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public translationService: TranslationService
  ) {}
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
    let getGames = this.gameService.getGames();
    loadingData.present().then(() => {
      Observable.forkJoin([getGames, getActivities])
              .subscribe(
                results => {
                    _.map(results[0], (element) => {
                      // console.log("game id: ", element[0].id);
                      this.cacheService.setLocal('game_id', element[0].id);
                    })
                    this.activities = results[1];
                    if(this.activities.length == 0){
                      this.returnError = true;
                    }
                    let getCharacter = this.characterService.getCharacter();
                    let getSubmission = this.submissionService.getSubmissionsData();
                    Observable.forkJoin([getSubmission, getCharacter])
                              .subscribe(results => { 
                                this.submissionData = results[0];
                                _.forEach(this.submissionData, element => {
                                  if(element.AssessmentSubmission.status == 'published'){
                                    this.submissionPoints += parseFloat(element.AssessmentSubmission.moderated_score);
                                  }
                                });
                                loadingData.dismiss().then(() => {
                                  this.percentageValue = (this.submissionPoints/this.submissionData.length)*100;
                                  this.currentPercentage = this.percentageValue.toFixed(2);
                                  // console.log("Percent: ", this.currentPercentage); // display as string format
                                  this.characterData = results[1].Characters[0];
                                  this.cacheService.setLocal('character_id', this.characterData.id)
                                  console.log("character id: ", this.characterData.id);
                                  this.characterCurrentExperience = this.characterData.experience_points;
                                  // console.log("Experience: ", this.characterCurrentExperience);
                                })
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
}
