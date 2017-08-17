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
  answers: any; // to render & display submitted answers

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

    // preset key used for caching later (locally and remote data)
    this.questions = this.normaliseQuestions(this.assessmentGroup.AssessmentGroupQuestion);
    this.formGroup = this.retrieveProgress(
      this.buildFormGroup(this.questions),
      this.formInProgressAnswer(this.submission)
    );
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

    this.group = this.navParams.get('group') || [
      {
        type: 'oneof'
      },
      {
        type: 'file'
      },
      {
        type: 'text'
      }
    ];

    console.log('this.group', this.group)

  /**
   * turn answer into answer submission format (which is formatted for POST to post_assessment API)
   * @param {object} submission single submission object retrieve from previous page/view
   * @return {object} formatted submission answer
   */
  private formInProgressAnswer(submission) {
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

    // Error handling for all kind of non-specific API respond error code
    failureAlert = this.displayAlert({
      title: 'Fail to submit',
      buttons: ["Ok"]
    }),
    successAlert = this.displayAlert({
      title: 'Checkin Successful!',
      buttons: ["Ok"]
    });

    let saveProgress = () => {
      let save = self.assessmentService.save(self.storeProgress());
      loading.present().then(() => {
        // if event then submit directly
        if (_.isEmpty(self.event)) {
          save = self.assessmentService.save(self.storeProgress(), {inProgress: false});
        }

        save.subscribe(
          response => {
            loading.dismiss().then(() => {
              if (!_.isEmpty(self.event)) {
                // display checkin successful (in event submission)
                successAlert.present().then(() => {
                  self.navCtrl.pop();
                });
              } else {
                // "in progress" save, redirect back to page
                self.navCtrl.pop();
              }
            });
          },
          reject => {
            loading.dismiss().then(() => {
              failureAlert.present().then(() => {
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
