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
  submissions: any;
  assessment: any;
  assessmentGroup: any;
  cacheKey: any; // to render & display stored
  canUpdateInput: boolean = false;
  published: boolean = false;

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
    this.submissions = this.navParams.get('submissions') || {};

    // preset key used for caching later (locally and remote data)
    this.canUpdateInput = this.isInputEditable();
    this.published = this.assessmentService.isPublished(this.submissions);
    this.questions = this.normaliseQuestions(this.assessmentGroup.AssessmentGroupQuestion);
    this.questions = this.mapQuestionsFeedback(this.questions, this.submissions);
    this.formGroup = this.retrieveProgress(this.buildFormGroup(this.questions));

    console.log('this.submissions', this.submissions);
    console.log('this.assessment', this.assessment);
    console.log('this.questions', this.questions);
  }

  /**
   * @description check answers are editable
   *    Must define submissions first
   * @type {boolen}
   */
   private isInputEditable = ():boolean => {
     let editable = false;
     if (!this.submission) {
       return true;
     }

     _.forEach(this.submissions, (submission) => {
       _.forEach(submission, (subm) => {
         if (
           subm.AssessmentSubmission &&
           subm.AssessmentSubmission.status === 'in progress'
         ) {
           editable = true;
         }
       });
     });
     return editable;
   }

  /**
   * @description use proper context id based on situation
   *
   * @type {array}
   */
  private mapQuestionsFeedback = (questions, submissions):any => {
    _.forEach(submissions, (submission) => {
      _.forEach(submission, (subm) => {
        _.forEach(subm.AssessmentReviewAnswer, (reviewAnswer) => {
          _.forEach(questions, (question, idx) => {

            if (reviewAnswer.assessment_question_id === question.id) {
              // text type
              if (question.type === 'text') {
                questions[idx].review_answer = reviewAnswer;
              }

              // oneof type
              if (question.type === 'oneof') {
                questions[idx].review_answer = reviewAnswer;
                _.forEach(question.choices, (choice, key) => {
                  if (choice.id == reviewAnswer.answer && choice.id == question.answer.answer) {
                    questions[idx].choices[key].name = choice.name + ' (you and reviewer)';
                  }
                  if (choice.id != reviewAnswer.answer && choice.id == question.answer.answer) {
                    questions[idx].choices[key].name = choice.name + ' (you)';
                  }
                  if (choice.id == reviewAnswer.answer && choice.id != question.answer.answer) {
                    questions[idx].choices[key].name = choice.name + ' (reviewer)';
                  }
                });
              }
            }

          });
        });
      });
    });
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
   * @TODO: confirm with backend how checkbox value submission is handled
   * @description format checkbox value before post back to server
   */
  getCheckboxValues(choices) {
    let result = {};
    // choices
    return result;
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

    // final step - save to localstorage
    let submission = {
      Assessment: {
          id: this.activity.assessment.id,
          context_id: this.activity.assessment.context_id
      },
      // AssessmentSubmission: (this.submissions[0] && this.submissions[0].id) ? { id: this.submissions[0].id } : {},
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
  retrieveProgress = (questions: Array<any>) => {
    let cachedProgress = this.cache.getLocalObject(this.cacheKey);

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


  /*
    Turn AssessmentQuestion object from:
    {
      Assessment: {
        id: 123
      },
      AssessmentQuestion: [
        {
          id: 234,
          question_type: 'file',
          audience: "[\"reviewer\",\"submitter\"]",
          file_type: 'image',
          choices: [],
          answers: {
            submitter: [],
            reviewer: [],
          },
          name: 'Question 234',
          required: true
        }
        ...
      ]
    }

    to:
    [
      {
        id: 234,
        assessment_id: 123
        name: 'Question 234',
        type: 'file',
        audience: "[\"reviewer\",\"submitter\"]",
        file_type: 'image',
        choices: []
      },
      ...
    ]
   */
  private normaliseQuestions = (questions: any[]) => {
    let result = [];

    (questions || []).forEach((question) => {
      let normalised = this.assessmentService.normaliseQuestion(question);

      result.push(normalised);
    });

    return result;
  };

  /**
   * @description initiate save progress and return to previous page/navigation stack
   */
  save() {
    let loading = this.loadingCtrl.create({
      content: 'Loading...'
    });

    // Error handling for all kind of non-specific API respond error code
    let alert = this.alertCtrl.create({
      title: 'Fail to submit',
      buttons: ["Ok"]
    });

    let saveProgress = () => {
      let save = this.assessmentService.save(this.storeProgress());
      loading.present().then(() => {
        if (_.isEmpty(this.event)) { // if event then submit directly
          save = this.assessmentService.save(this.storeProgress(), {inProgress: false});
        }
        save.subscribe(
          response => {
            loading.dismiss().then(() => {
              this.navCtrl.pop();
            });
          },
          reject => {
            loading.dismiss().then(() => {
              alert.present().then(() => {
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
