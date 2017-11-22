import { Component } from '@angular/core';
import { ModalController, NavParams, NavController, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

// pages
import { ActivitiesViewModalPage } from './activities-view-modal.page';
import { AssessmentsPage } from '../../assessments/assessments.page';
import { ActivityService } from '../../../services/activity.service';
import { SubmissionService } from '../../../services/submission.service';
// Others
import * as _ from 'lodash';

@Component({
  templateUrl: './view.html'
})
export class ActivitiesViewPage {
  achievements: any = {
    available: [],
    obtained: {},
    maxPoints: {}
  };
  activity: any = {};
  assessment: any = {};
  loadings = {
    submissions: false
  };
  submissions: Array<any> = [];

  constructor(
    public activityService: ActivityService,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public submissionService: SubmissionService
  ) {}

  ionViewWillEnter(): void {
    this.loadings.submissions = true;
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
    this.assessment = this.activity.assessment;

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

          this.submissions = this.setSubmissionStatusTitle(this.submissions);
        }
      });

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

  public extractBadges(): Array<any> {
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

  /**
   * @name setSubmissionStatusTitle
   * @description refer to assessment status and inject proper UI displayable title for different submissions (in a assessments, multiple submission has no unique title, this function is added to help user identify different submission by title)
   * @param {Array<object>} submissions submissions array objects
   */
  setSubmissionStatusTitle(submissions: Array<any>) {
    submissions = submissions.map((submission, index) => {
      let result: {
        name: string,
        score: number,
        published: boolean,
        inprogress: boolean,
        moderated_assessment: boolean
      } = {
        name: '',
        score: 0,
        published: false,
        inprogress: false,
        moderated_assessment: false
      };

      if (submission.status == "published") {
        result.published = true;

        switch (submission.moderated_score) {
          case "1":
            result.score = 4;
            result.name = "Outstanding";
            break;
          case "0.75":
            result.score = 3;
            result.name = "Commendable";
            break;
          case "0.5":
            result.score = 2;
            result.name = "Competent";
            break;
          case "0.25":
            result.score = 1;
            result.name = "Developing";
            break;
          case "0":
            result.score = 0;
            result.name = "Needs Improvement";
        }
      } else if(submission.status == "in progress") {
        result.inprogress = true;
      } else {
        result.inprogress = false;
      }

      if (submission.assessment.assessment_type == "moderated") {
        result.moderated_assessment = true;
      }

      submission.statusTitle = result;
      return submission;
    });

    return submissions;
  }
}
