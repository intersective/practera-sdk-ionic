import { Component, OnInit } from '@angular/core';
import { NavParams, NavController, AlertController, LoadingController, Events } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { CacheService } from '../../../shared/cache/cache.service';
import { ChoiceBase, QuestionBase, Submission, AssessmentService } from '../../../services/assessment.service';

import * as _ from 'lodash';

@Component({
  selector: 'assessments-group-page',
  templateUrl: './assessments-group.html',
})
export class AssessmentsGroupPage implements OnInit {
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
    private loadingCtrl: LoadingController,
    public events: Events
  ) {}

  ngOnInit() {
    // navigate from activity page
    this.activity = this.navParams.get('activity') || {};

    // navigate from event page
    this.event = this.navParams.get('event') || {};
    if (!_.isEmpty(this.event)) {
      this.activity = this.event;
    }
  }

  ionViewDidEnter() {
    this.assessment = this.activity.assessment; // required for context_id
    this.cacheKey = `assessment.group.${this.assessment.context_id}`;
    this.assessmentGroup = this.navParams.get('assessmentGroup') || {};
    this.submission = this.navParams.get('submission') || {};
    // preset key used for caching later (locally and remote data)
    this.canUpdateInput = this.isInputEditable(this.submission);
    // this.published = this.assessmentService.isPublished(this.submissions);
    this.questions = this.assessmentGroup.questions;
    this.questions = this.mapQuestionsFeedback(this.questions, this.submission);
    this.formGroup = this.retrieveProgress(
      this.buildFormGroup(this.questions),
      this.formInProgressAnswer(this.submission)
    );
  }

  updateSubmission() {
    this.events.publish('assessment:changes', {
      changed: true
    });
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
        if (review.assessment_question_id === question.question_id) {
          // text type (no merging, text question displayed in plain text)
          if (question.type === 'text') {
            questions[idx].review_answer = review;
          }

          // oneof type
          // combine question, when answered by both reviewer and submitter
          if (question.type === 'oneof') {
            questions[idx].review_answer = review;
            let submitterAnswer = question.answer;

            _.forEach(question.choices, (choice, key) => {
              if (!_.isEmpty(submitterAnswer)) {
                if (choice.id == review.answer && choice.id == submitterAnswer.answer) {
                  questions[idx].choices[key].name = choice.name + ' (you and reviewer)';
                }
                else if (choice.id != review.answer && choice.id == submitterAnswer.answer) {
                  questions[idx].choices[key].name = choice.name + ' (you)';
                }
                else if (choice.id == review.answer && choice.id != submitterAnswer.answer) {
                  questions[idx].choices[key].name = choice.name + ' (reviewer)';
                }
              } else if (choice.id == review.answer) { // display reviewer answer
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
    //         if (reviewAnswer.assessment_question_id === question.question_id) {
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
    _.forEach(this.formGroup, fg => {
      // check formGroup.validation & each field (answer & comment) validity
      if (!fg.valid && (!fg.controls.answer.valid && !fg.controls.comment.valid)) {
        passed = false;
      }
    });
    return passed;
  };

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

      /**
       * id and question_id are different id
       * - id =  has no obvious purpose
       * - question_id must be used as id for submission
       *
       * but for case like this just for index id
       */
      result[question.question_id] = new FormGroup(group);
    });

    return result;
  };

  /**
   * turn answer into answer submission format (which is formatted for POST to post_assessment API)
   * @param {object} submission single submission object retrieve from previous page/view
   * @return {object} formatted submission answer
   */
  private formInProgressAnswer(submission): boolean | Submission {
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
    _.forEach(this.formGroup, (question, question_id) => {
      let values = question.getRawValue(),
          answer = {
            assessment_question_id: question_id,
            answer: values.answer || values.comment,

            // store it if choice answer is available or skip
            choices: (!_.isEmpty(values.choices)) ? values.choices : null
          };

      // set empty string to remove answer
      answer.answer = (answer.answer) ? answer.answer : '';
      answers[question_id] = answer;
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
    let cachedProgress = answers || {}; //this.cache.getLocalObject(this.cacheKey);

    let newQuestions = questions;
    let savedProgress = cachedProgress.AssessmentSubmissionAnswer;

    if (!_.isEmpty(savedProgress)) {

      // index "id" is set as question.question_id in @Function buildFormGroup above
      _.forEach(newQuestions, (question, question_id) => {
        // check integrity of saved answer (question might get updated)
        if (savedProgress[question_id] && savedProgress[question_id].assessment_question_id == question_id) {
          newQuestions[question_id] = this.setValueWith(question, savedProgress[question_id]);
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
      this.updateSubmission();

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
