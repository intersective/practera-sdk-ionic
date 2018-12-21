import { Component } from '@angular/core';
import { ModalController, NavParams, NavController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { default as Configure } from '../../../configs/config';
// pipes
import { TruncatePipe } from '../../../pipes/truncate.pipe';
// pages
import { ActivityAchievementModalPage } from './activity-achievement.modal.page';
import { ActivitiesViewModalPage } from './activities-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
//services
import { AchievementService } from '../../../services/achievement.service';
import { ActivityService } from '../../../services/activity.service';
import { SubmissionService } from '../../../services/submission.service';
import { CacheService } from '../../../shared/cache/cache.service';

@Component({
  templateUrl: './view.html'
})
export class ActivitiesViewPage {
  public hardcode_activity_id: any = Configure.hardcode_activity_id;
  public logo_act1 = "./assets/img/badges/badge7.svg";
  public activityIDsArrary: any = [];
  public submissionTitles: any = [];
  public submissionTitle: any = [];
  public newSubmissionTitle: any = [];
  public tickArray: any = [];
  public newTickArray: any = [];
  public tickedCount: any = 0;
  public ticksLength: any = 0;
  public newTickIDsArray: any = [];
  public newTickIDsData: any = [];
  public achievementData: any = [];
  public findAchievementObj: any = [];
  public portfolioView: boolean = false;
  public activity: any = {};
  public activityIndex: any = 0;
  public assessment: any = {};
  public assessments: any = {};
  public submissions: Array<any> = [];
  public eachFinalScore: any = 0;
  public eachScore: any = 0;
  public achievements: any = {
    available: [],
    obtained: {},
    maxPoints: {}
  };
  public loadings = {
    submissions: false
  };
  public isReadonly: boolean = false;

  initialised_eset() {
    this.isReadonly = this.cache.isReadonly();

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
    private alertCtrl: AlertController,
    private cache: CacheService
  ) {
    this.portfolioView = this.navParams.get('portfolioView');
  }
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
    // <Activity ID> is the activity id of career strategist, checking this id to see if all skills activities has been revealed.
    if (this.activityIDsArrary.includes(this.hardcode_activity_id)){
      this.logo_act1 = "./assets/img/badges/badge1.svg"; // if <Activity ID> exist, show career logo for the first activity, otherwise, show product logo for the first activity.
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
          if(this.portfolioView == true){
            let result = [];
            (this.submissions || []).forEach(submission => {
              if (submission.status !== 'in progress') {
                result.push(submission);
              }
            });
            this.submissions = result;
          }else {
            this.submissions = _.orderBy(this.submissions, 'created', 'desc'); // latest at top
          }
        }
      });
      this.submissionTitles = this.getSubmissionStatus(this.submissions); // get user assessment status based on its achieved marks
      this.submissionTitle = this.getSubmissionTitle(this.submissions); // get user named assessment submission title
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
   * hide or show the "Plus" button (navigation to create new assessment submission)
   */
  allowSubmission(assessment, submissions) {
    let isAllow = true;
    // when is_repeatable is false, then don't allow more than one submission of assessment
    if (!assessment.is_repeatable && submissions.length > 0) {
      isAllow = false;
    }

    return isAllow;
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
        title: 'You already have started a new submission! Please tap on "In Progress" below to continue with it.',
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
  getSubmissionStatus(Submissions){ // get user assessment status based on its achieved marks
    let result: any = [];
    let result_name = "";
    let result_score = 0;
    let published = false;
    let inprogress = false;
    let moderated_assessment = false;
    for (let index = 0; index < Submissions.length; index++){
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
      if (Submissions[index].assessment.assessment_type == "moderated"){
        moderated_assessment = true;
      } else {
        moderated_assessment = false;
      }
      let result_single: any = {
        published,
        result_score,
        result_name,
        inprogress,
        moderated_assessment
      }
      result.push(result_single);
    }
    return result;
  }
  getSubmissionTitle(Submissions){ // get user named assessment submission title
    let assessment_question_id: any = 0;
    let hardcodeAssessmentIds = Configure.hardcodeAssessmentIds;
    let hardcodeQuestionIDs = Configure.hardcodeQuestionIDs;
    if(Submissions[0]){
      for(let i = 0; i < hardcodeAssessmentIds.length; i++){
        if(Submissions[0].assessment_id === hardcodeAssessmentIds[i]){
          assessment_question_id = hardcodeQuestionIDs[i];
        }
      }
      _.forEach(Submissions, (element, index) => {
        _.forEach(element.answer, (ele, index) => {
          if(ele.assessment_question_id === assessment_question_id) {
            if(ele.answer){
              this.newSubmissionTitle.push(ele.answer);
            }else {
              this.newSubmissionTitle = [];
            }
          }
        })
      });
      return this.newSubmissionTitle;
    }
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
