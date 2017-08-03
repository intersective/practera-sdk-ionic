import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { CacheService } from '../../../shared/cache/cache.service';
import { ChoiceBase, QuestionBase, Submission, AssessmentService } from '../../../services/assessment.service';

import * as _ from 'lodash';

@Component({
  templateUrl: './assessments-group.html',
})
export class AssessmentsGroupPage {
  questions = [];
  formGroup;

  // used when navigate from event view page
  event: any;

  //@TODO: decide which one to use
  activity: any;
  submission: Submission;
  assessment: any;
  assessmentGroup: any;
  cacheKey: any; // to render & display stored

  canUpdateInput: boolean = false;
  published: boolean = false;
  answers: any; // to render & display submitted answers
  inProgress: boolean | any;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private cache: CacheService,
    private assessmentService: AssessmentService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ionViewDidEnter() {
    // navigate from activity page
    this.activity = this.navParams.get('activity') || {};

    // navigate from event page
    this.event = this.navParams.get('event') || {};
    if (!_.isEmpty(this.event)) {
      this.activity = this.event;
    }

    this.assessment = this.activity.assessment;
    this.cacheKey = `assessment.group.${this.assessment.context_id}`;

    this.assessmentGroup = this.navParams.get('assessmentGroup') || {};
    this.submission = this.navParams.get('submission') || {};

    console.log('this.assessmentGroup', this.assessmentGroup);

    // preset key used for caching later (locally and remote data)
    this.canUpdateInput = this.isInputEditable(this.submission);
    // this.published = this.assessmentService.isPublished(this.submissions);
    this.questions = this.assessmentGroup.questions;
    this.questions = this.mapQuestionsFeedback(this.questions, this.submission);
    this.formGroup = this.retrieveProgress(
      this.buildFormGroup(this.questions),
      this.formInProgressAnswer(this.submission)
    );

    console.log('this.submission', this.submission);
    console.log('this.assessment', this.assessment);
    console.log('this.questions', this.questions);
  }

  /**
   * @description check answers are editable
   *    Must define submissions first
   * @type {boolen}
   */
   // @TODO modify needed
   private isInputEditable = (submission):boolean => {
     if (_.isEmpty(submission) || submission.status === 'in progress') {
       return true;
     }
     return false;
    //  let editable = false;
    //  _.forEach(this.submissions, (submission) => {
    //    if (_.isEmpty(submission)) {
    //      editable = true;
    //    } else {
    //      _.forEach(submission, (subm) => {
    //        if (
    //          subm.AssessmentSubmission &&
    //          subm.AssessmentSubmission.status === 'in progress'
    //        ) {
    //          editable = true;
    //        }
    //      });
    //    }
    //  });
    //  return editable;
   }

  /**
   * @description use proper context id based on situation
   *
   * @type {array}
   */
   // @TODO modify
  private mapQuestionsFeedback = (questions, submission):any => {
    if (_.isEmpty(submission) || _.isEmpty(submission.review) || submission.status !== 'published') {
      return questions;
    }

    _.forEach(submission.review, (review) => {
      _.forEach(questions, (question, idx) => {
        if (review.assessment_question_id === question.id) {
          // text type
          if (question.type === 'text') {
            questions[idx].review_answer = review;
          }

          // oneof type
          if (question.type === 'oneof') {
            questions[idx].review_answer = review;
            _.forEach(question.choices, (choice, key) => {
              if (choice.id == review.answer && choice.id == question.answer.answer) {
                questions[idx].choices[key].name = choice.name + ' (you and reviewer)';
              }
              if (choice.id != review.answer && choice.id == question.answer.answer) {
                questions[idx].choices[key].name = choice.name + ' (you)';
              }
              if (choice.id == review.answer && choice.id != question.answer.answer) {
                questions[idx].choices[key].name = choice.name + ' (reviewer)';
              }
            });
          }
        }
      });
    });

    // _.forEach(submissions, (submission) => {
    //   _.forEach(submission, (subm) => {
    //
    //     _.forEach(subm.AssessmentReviewAnswer, (reviewAnswer) => {
    //       _.forEach(questions, (question, idx) => {
    //
    //         if (reviewAnswer.assessment_question_id === question.id) {
    //           // text type
    //           if (question.type === 'text') {
    //             questions[idx].review_answer = reviewAnswer;
    //           }
    //
    //           // oneof type
    //           if (question.type === 'oneof') {
    //             questions[idx].review_answer = reviewAnswer;
    //             _.forEach(question.choices, (choice, key) => {
    //               if (choice.id == reviewAnswer.answer && choice.id == question.answer.answer) {
    //                 questions[idx].choices[key].name = choice.name + ' (you and reviewer)';
    //               }
    //               if (choice.id != reviewAnswer.answer && choice.id == question.answer.answer) {
    //                 questions[idx].choices[key].name = choice.name + ' (you)';
    //               }
    //               if (choice.id == reviewAnswer.answer && choice.id != question.answer.answer) {
    //                 questions[idx].choices[key].name = choice.name + ' (reviewer)';
    //               }
    //             });
    //           }
    //         }
    //
    //       });
    //     });
    //   });
    // });
    return questions;
  }

  /**
   * @description use proper context id based on situation
   *       event's checkin, use event context_id (reference array in get_event)
   *       assessment submission, use context_id from get_activity
   *
   * @type {number}
   */
  private getSubmissionContext = ():number => {
    // if event object is available
    if (this.event) {
      return this.event.context_id;
    }

    // if "event" not available, use assessment instead
    return this.assessment.context_id;
  }

  /**
   * check the questions was answered
   * @return {boolen} passed all check
   */
  isAllQuestionsAnswered = () => {
    let passed = true;
    _.forEach(this.formGroup, (fg) => {
      if (fg.value.answer === '') {
        passed = false;
      }
    });
    return passed;
  }

  /**
   * turn a collection of questions into angular's FormGroup to share among components
   * @param {array} questions list of questions from a question group (Assessment group)
   */
  buildFormGroup = (questions) => {
    let result: any = {};

    this.questions.forEach(question => {
      let currentAnswer = question.answer || {};
      let group = {
        answer: question.required ?
          new FormControl(currentAnswer.answer || '', Validators.required) : new FormControl(currentAnswer.answer || ''),
        comment: question.required ?
          new FormControl(currentAnswer.comment || '', Validators.required) : new FormControl(currentAnswer.comment || '')
      };

      // render choices' FormGroup
      let choices = {};
      if (question.choices && question.type === 'multiple') {
        question.choices.forEach(choice => {
          let answer = (question.choices) ? question.choices[choice.id] : false;
          choices[choice.id] = new FormControl(answer);
        });
        group['choices'] = new FormGroup(choices);
      }

      result[question.id] = new FormGroup(group);
    });

    return result;
  };

  /**
   * turn answer into answer submission format (which is formatted for POST to post_assessment API)
   * @param {object} submission single submission object retrieve from previous page/view
   * @return {object} formatted submission answer
   */
  private formInProgressAnswer(submission) {
    if (_.isEmpty(submission)) {
      return false;
    }

    let answers = {};
    submission.answer.forEach(ans => {
      answers[ans.assessment_question_id] = {
        assessment_question_id: ans.assessment_question_id,
        answer: ans.comment || ans.answer
      }
    });

    return {
      Assessment: {
          id: submission.assessment_id,
          context_id: this.getSubmissionContext()
      },
      AssessmentSubmissionAnswer: answers
    };
  }

  /**
   * @description store assessment answer/progress locally
   */
  storeProgress = () => {
    let answers = {};
    _.forEach(this.formGroup, (question, id) => {
      let values = question.getRawValue(),
          answer = {
            assessment_question_id: id,
            answer: values.answer || values.comment,

            // store it if choice answer is available or skip
            choices: (!_.isEmpty(values.choices)) ? values.choices : null
          };

      answers[id] = answer;
    });

    // final step - store submission locally
    let submission = {
      Assessment: {
          id: this.activity.assessment.id,
          context_id: this.activity.assessment.context_id
      },
      AssessmentSubmissionAnswer: answers
    };
    this.submission = submission;

    // local cache key
    this.cache.setLocal(this.cacheKey, JSON.stringify(submission));
    return submission;
  };

  /**
   * @description retrieve saved progress from localStorage
   */
  retrieveProgress = (questions: Array<any>, answers?) => {
    let cachedProgress = answers || this.cache.getLocalObject(this.cacheKey);

    let newQuestions = questions;
    let savedProgress = cachedProgress.AssessmentSubmissionAnswer;

    if (!_.isEmpty(savedProgress)) {

      // index "id" is set as question.id in @Function buildFormGroup above
      _.forEach(newQuestions, (question, id) => {
        // check integrity of saved answer (question might get updated)
        if (savedProgress[id] && savedProgress[id].assessment_question_id == id) {
          newQuestions[id] = this.setValueWith(question, savedProgress[id]);
        }
      });
    }
    return newQuestions;
  };

  /**
   * @description set value to each FormControl differently based on type:
   *              - "text", "oneof" & "file" using just "answer" field
   *              - "multiple" answer is stored into "choices" FormControl instead
   * @param {FormGroup} question FormGroup for a question
   * @param {Object} answers answer [choices object || string answer]
   */
  private setValueWith(question, answers) {
    if (!_.isEmpty(answers.choices)) {
      question.controls.choices.setValue(answers.choices);
    } else {
      question.controls.answer.setValue(answers.answer || '');
    }
    return question;
  }

  displayAlert(opts) {
    return this.alertCtrl.create(opts);
  }

  /**
   * @description initiate save progress and return to previous page/navigation stack
   */
  save() {
    let self = this,
    loading = this.loadingCtrl.create({
      content: 'Loading...'
    }),
    // to provide a more descriptive error message (if available)
    failAlert = this.alertCtrl.create({
      title: 'Fail to submit.'
    });

    let saveProgress = () => {
      loading.present().then(() => {
        self.assessmentService.save(self.storeProgress()).subscribe(
          response => {
            loading.dismiss().then(() => {
              self.navCtrl.pop();
            });
          },
          reject => {
            loading.dismiss().then(() => {
              failAlert.data.title = reject.msg || failAlert.data.title;
              failAlert.present().then(() => {
                console.log('Unable to save', reject);
              });
            });
          }
        );
      });
    };

    let confirmBox = this.alertCtrl.create({
      message: 'You have not completed all required questions. Do you still wish to Save?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            saveProgress();
          }
        },
        {
          text: 'No',
          handler: () => {
            //return false;
          }
        }
      ]
    });

    if (!this.isAllQuestionsAnswered()) {
      confirmBox.present();
    } else {
      saveProgress();
    }
  }
}
