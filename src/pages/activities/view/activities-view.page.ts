import { Component } from '@angular/core';
import { ModalController, NavParams, NavController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
// pages
import { ActivityAchievementModalPage } from './activity-achievement.modal.page';
import { ActivitiesViewModalPage } from './activities-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
//services
import { AchievementService } from '../../../services/achievement.service'; 
import { ActivityService } from '../../../services/activity.service';
import { SubmissionService } from '../../../services/submission.service';
@Component({
  templateUrl: './view.html'
})
export class ActivitiesViewPage {
  public logo_act1 = "./assets/img/badges/badge7.svg";
  public activityIDsArrary: any = [];
  public submissionTitles: any = [];
  public tickArray: any = [];
  public newTickArray: any = [];
  public tickedCount: any = 0;
  public ticksLength: any = 0;
  public newTickIDsArray: any = [];
  public newTickIDsData: any = [];
  public achievementData: any = [];
  public findAchievementObj: any = [];
  activity: any = {};
  activityIndex: any = 0;
  assessment: any = {};
  assessments: any = {};
  submissions: Array<any> = [];
  eachFinalScore: any = 0;
  eachScore: any = 0;
  achievements: any = {
    available: [],
    obtained: {},
    maxPoints: {}
  };
  loadings = {
    submissions: false
  };
  initialised_eset() {
    this.findAchievementObj = [];
    this.achievementData = [];
    this.newTickIDsArray = [];
    this.newTickIDsData = [];
    this.newTickArray = [];
    this.ticksLength = 0;
    this.tickedCount = 0;
    this.activityIndex = 0;
    this.eachFinalScore = 0;
    this.loadings.submissions = true;
  }
  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private achievementService: AchievementService,
    private activityService: ActivityService,
    private submissionService: SubmissionService,
    private alertCtrl: AlertController
  ) {}
  ionViewWillEnter(): void {
    this.initialised_eset();
  }
  // @TODO: use simple mock data for assessment first
  /**
   * on assessment implementation, to do list:
   * - load badges
   * - change icon display based on responded data format
   * - load submission into this.submissions
   * - change template view based on responded data format
   */
  ionViewDidEnter(): void {
    // assessment
    this.activity = this.activityService.normaliseActivity(this.navParams.get('activity') || {});
    this.assessments = this.activity.sequences || [];
    this.assessment = this.activity.assessment;
    this.activityIndex = this.navParams.get('activity').Activity.Activity.indexID;
    this.activityIDsArrary = this.navParams.get('activityIDs');
    this.tickArray = this.navParams.get('tickArray');
    this.newTickArray = this.tickArray[this.activityIndex-1];
    this.ticksLength = this.newTickArray.length;
    this.eachFinalScore = this.navParams.get('eachFinalScore');
    this.eachScore = this.eachFinalScore[this.activityIndex-1];
    this.newTickIDsArray = this.navParams.get('newTickIDsArray');
    this.newTickIDsData = this.newTickIDsArray[this.activityIndex-1];
    // This is a hardcode (temporary solution).
    // <7632> is the activity id of career strategist, checking this id to see if all skills activities has been revealed.
    if (this.activityIDsArrary.includes(7632)){
      this.logo_act1 = "./assets/img/badges/badge1.svg"; // if 7632 exist, show career logo for the first activity, otherwise, show product logo for the first activity.
    }
    // all achievements data
    this.achievementService.getAll()
        .subscribe(
          data => {
            for(let m = 0; m < data.length; m++){
              for(let n = 0; n < this.newTickIDsData.length; n++){
                if(this.newTickIDsData[n] == data[m].Achievement.id)
                  this.achievementData.push(data[m].Achievement);
              }
            }
          },
          err => {
            console.log(err);
          }
        );
    // submission
    this.submissions = [];
    Observable.forkJoin(this.submissionService.getSubmissionsByReferences(this.activity.References)).subscribe(responses => {
      // turn nested array into single dimension array
      responses.forEach((submissions: Array<any>) => {
        if (submissions.length > 0) {
          this.submissions = submissions.map(submission => {
            return this.submissionService.normalise(submission);
          });
          this.submissions = _.orderBy(this.submissions, 'created', 'desc'); // latest at top
        }
      });
      this.submissionTitles = this.getSubmissionTitle(this.submissions);
      this.loadings.submissions = false;
    });
    // badges
    this.achievements = this.navParams.get('achievements');
    this.activity.badges = this.extractBadges();
    this.activity.badges.map((badge, index) => {
      if ((this.activity.id % 3) != 0) {
        badge.disabled = false;
      } else {
        badge.disabled = true;
      }
    });
    this.badgeData();
  }
  // achievement popup model 
  achievementPopup(id){
    for(let a = 0; a < this.achievementData.length; a++){
      if(this.achievementData[a].id == this.newTickIDsData[id]){
        this.findAchievementObj = this.achievementData[a];
      }
    }
    let achievementPopupModal = this.modalCtrl.create(ActivityAchievementModalPage, { achievementData: this.findAchievementObj });
    achievementPopupModal.present();
  }
  // extract "in progress"
  inProgressSubmission() {
    let result = [];
    (this.submissions || []).forEach(submission => {
      if (submission.status === 'in progress') {
        result.push(submission);
      }
    });
    return result;
  }
  private extractBadges(): Array<any> {
    let result = [];
    if (this.achievements.available && this.achievements.available.length > 0) {
      this.achievements.available.forEach(achievement => {
        if (achievement.Achievement.badge) {
          result.push({
            url: achievement.Achievement.badge,
            disabled: false
          });
        }
      });
    }
    return result;
  }
  /**
   * @description display activity detail modal page
   */
  openModal() {
    let detailModal = this.modalCtrl.create(ActivitiesViewModalPage, {activity: this.activity});
    detailModal.present();
  }
  /**
   * @name goAssessment
   * @description direct to assessment page of a selected activity
   * @param {Object} activity single activity object from the list of
   *                          activities respond from get_activities API
   * @param {Object} opts optional object with
   *                 - hasSubmission: to indicateif user is accessing a in
   *                   progress assessment
   */
  goAssessment(submission?, opts = { hasSubmission: false }) {
    if ((this.inProgressSubmission()).length > 0 && opts.hasSubmission === false) {
      let alert = this.alertCtrl.create({
        title: 'You have a submission in progress.',
        buttons: ["Ok"]
      });
      alert.present();
    } else if (opts.hasSubmission === true) {
      this.navCtrl.push(AssessmentsPage, {
        activity: this.activity,
        assessment: this.assessment,
        submissions: this.submissions,
        currentSubmission: submission
      });
    } else {
      this.navCtrl.push(AssessmentsPage, {
        activity: this.activity,
        assessment: this.assessment
      });
    }
  }
  getSubmissionTitle(Submissions){
    let result: any = [];
    let result_name = "";
    let result_score = 0;
    let published = false;
    let inprogress = false
    for (let index = 0; index<Submissions.length; index++){
      if (Submissions[index].status == "published"){
        published = true;
        inprogress = false;
        switch (Submissions[index].moderated_score){
          case "1":
            result_score = 4;
            result_name = "Outstanding";
            break;
          case "0.75":
            result_score = 3;
            result_name = "Commendable";
            break;
          case "0.5":
            result_score = 2;
            result_name = "Competent";
            break;
          case "0.25":
            result_score = 1;
            result_name = "Developing";
            break;
          case "0":
            result_score = 0;
            result_name = "Needs Improvement";
        }
      } else if(Submissions[index].status == "in progress") {
        result_name = "";
        result_score = 0;
        published = false;
        inprogress = true;
      } else{
        result_name = "";
        result_score = 0;
        published = false;
        inprogress = false;
      }
      let result_single: any = {
        published,
        result_score,
        result_name,
        inprogress
      }
      result.push(result_single);
    }
    return result;
  }
  badgeData(){
    _.forEach(this.newTickArray, (element, index) => {
      if(element == true){
        this.tickedCount++;
      }
    });
    return this.tickedCount;
  }
}
