import { Component, OnInit } from '@angular/core';
import { NavParams, LoadingController, NavController } from 'ionic-angular';
import { AssessmentService } from '../../../services/assessment.service';
import { AssessmentsGroupPage } from '../../assessments/group/assessments-group.page'

import * as _ from 'lodash';


@Component({
  templateUrl: './portfolio.html'
})
export class PortfolioPage implements OnInit {
  assessmentGroups: any = [];
  submissions: any = [];
  allowSubmit: Boolean;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    public assessmentService :AssessmentService,
    public loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    /*let assessments = this.navParams.get('assessments');
    console.log(assessments);

    assessments = assessments.map(asmt => {
      return this.assessmentService.normalise(asmt);
    });
    console.log(assessments);

    // this.assessmentGroups = assessments;
    this.submissions = this.navParams.get('submissions');*/
  }

  ionViewWillEnter() {
    let loader = this.loadingCtrl.create();
    loader.present().then(() => {
      this.loadQuestions().then(res => {
        console.log(res);
        this.assessmentGroups = res.assessmentGroups;
        loader.dismiss();
      }).catch(err => {
        console.log(err);
        loader.dismiss();
      });
    });
  }

  loadQuestions(): Promise<any> {
    return new Promise((resolve, reject) => {

      /**
       * merging submission into question inside of assessment array objects
       * - set question statuses (quantity of total answered)
       * - set submission button status
       */
      console.log(this.assessmentGroups);
      this.assessmentGroups = this.mapSubmissionsToAssessment(
        this.submissions,
        this.navParams.get('assessments')
      );
      console.log(this.assessmentGroups);

      // Only allow submit when all required question have answered.
      _.forEach(this.assessmentGroups, groups => {
        _.forEach(groups, assessment => {
          let groupWithAnswers = 0;
          _.forEach(assessment.AssessmentGroup, group => {
            if (group.answeredQuestions >= group.totalRequiredQuestions) {
              groupWithAnswers += 1;
            }
          });
          if (groupWithAnswers >= _.size(assessment.AssessmentGroup)) {
            this.allowSubmit = true;
          }
        });
      });

      _.forEach(this.submissions, submission => {
        if (
          submission.status === 'pending review' ||
          submission.status === 'pending approval' ||
          submission.status === 'published' || // moderated type (reviews & published)
          submission.status === 'done' // survey type
        ) {
          this.allowSubmit = false;
        }
      });

      resolve({
        assessmentGroups: this.assessmentGroups,
        submissions: this.submissions
      });

    });
  }

  /**
   * @description mapping assessments and submissions
   * @param {Object} submissions submissions
   * @param {Object} assessments assessments
   * @returns {Array} objects of compiled assessment + submissions
   */
  mapSubmissionsToAssessment(submissions, batch) {

    let result = [];
    _.forEach(batch, assessment => {
      // normalised
      let normalised = this.assessmentService.normalise(assessment);

      // groups
      let assessmentGroupResult = [];
      _.forEach(normalised.AssessmentGroup, assessmentGroup => {
        // questions
        let questionsResult: any = [];
        let submissionResult : any = {};

        _.forEach(assessmentGroup.questions, question => {
          // Inject empty answer fields
          // We will know thare are no submission when it is null
          let questionResult : any = {
            answer: null,
            reviewerAnswer: null
          };

          let findSubmission = (submission) => {
            // attach existing submission to assessment group it belongs to
            if (assessmentGroup.assessment_id === submission.assessment_id) {
              submissionResult = submission;
            }

            // find user answer
            _.forEach(submission.answer, (answer) => {
              if (answer.assessment_question_id === question.question_id) {
                questionResult.answer = answer;
              }
            });

            // find reviewer feedback
            _.forEach(submission.review, (reviewerAnswer) => {
              if (reviewerAnswer.assessment_question_id === question.question_id) {
                questionResult.reviewerAnswer = reviewerAnswer;
              }
            });
          };

          // find submission
          _.forEach(submissions, findSubmission);

          // set assessmentGroup as accessible (submitter has no permission to view)
          if (this.isAccessibleBySubmitter(question, submissionResult.status)) {
            assessmentGroup.accessible = true;
            questionsResult.push(Object.assign(question, questionResult));
          }
        });

        // Summarise basic answer information
        let summaries = this.assessmentService.getSummaries(questionsResult);

        if (assessmentGroup.accessible) {
          assessmentGroupResult.push(Object.assign(assessmentGroup, {
            questions: questionsResult,
            submission: submissionResult,
            totalRequiredQuestions: summaries.totalRequiredQuestions,
            answeredQuestions: summaries.answeredQuestions,
            reviewerFeedback: summaries.reviewerFeedback,
            status: this.assessmentService.getStatus(questionsResult, submissionResult)
          }));
        }

      });

      normalised.AssessmentGroup = assessmentGroupResult;
      result.push(normalised);
    });

    return result;
  }


  // filter question by condition (submitter cannot view reviewer question before it is published/reviewed)
  isAccessibleBySubmitter(question, submissionStatus: string) {
    let accessible = true;
    let submitterAllowed = false;

    if (question.audience.indexOf('submitter') !== -1) {
      submitterAllowed = true;
    }

    if (!submitterAllowed && submissionStatus !== 'published') {
      accessible = false;
    }

    return accessible;
  }

  gotoAssessment(assessmentGroup, activity) {
    this.navCtrl.push(AssessmentsGroupPage, {
      assessmentGroup,
      activity,
      submission: assessmentGroup.submission, // use back the one back from ActivityViewPage
      submissions: this.submissions
    });
  }
}
