import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CacheService } from '../../../shared/cache/cache.service';

import * as _ from 'lodash';

export class ChoiceBase<T> {
  id: number;
  name: string;
}

export class AnswerBase<T> {
  answer: string;
  url: string;
  mimetype: string;
}

export class QuestionBase<T> {
  type: string;
  choices: ChoiceBase<any>[];
  answers: {
    submitter: AnswerBase<any>[],
    reviewer: AnswerBase<any>[],
  };
  name: string;
  required: boolean;
}

@Component({
  templateUrl: './assessments-group.html',
})
export class AssessmentsGroupPage {
  questions = [];
  formGroup;
  temp;

  //@TODO: decide which one to use
  assessment: any;
  activity: any;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private cache: CacheService
  ) {
  }

  buildFormGroup(questions) {
    let group: any = {};

    this.questions.forEach(question => {
      group[question.id] = new FormGroup({
        answer: question.required ? new FormControl(question.answer || '', Validators.required) : new FormControl(question.answer || ''),
        comment: question.required ? new FormControl(question.comment || '', Validators.required) : new FormControl(question.comment || ''),
      });

    });

    return group;
  }

  ionViewDidEnter() {
    this.activity = this.navParams.get('activity');
    this.assessment = this.navParams.get('assessment');

    this.questions = this.navParams.get('questions') || [
      {
        id: 4,
        type: 'file',
        choices: [],
        answers: {
          submitter: [],
          reviewer: [],
        },
        name: 'TASK: What was actually required of me in that situation?',
        required: true
      },
      {
        id: 1,
        type: 'oneof',
        choices: [
          {
            id: 1,
            name: 'Test 1'
          },
          {
            id: 2,
            name: 'Test 2'
          },
          {
            id: 3,
            name: 'Test 3'
          },
        ],
        answers: {
          submitter: [],
          reviewer: [],
        },
        name: 'SITUATION: The context in which this experience took place',
        required: true
      },
      {
        id: 2,
        type: 'text',
        choices: [],
        answers: {
          submitter: [],
          reviewer: [],
        },
        name: 'TASK: What was actually required of me in that situation?',
        required: true
      },
      {
        id: 3,
        type: 'text',
        choices: [],
        answers: {
          submitter: [],
          reviewer: [],
        },
        name: 'ACTION: What did I do given the situation and the task?',
        required: true
      },
    ];

    this.formGroup = this.retrieveProgress(this.buildFormGroup(this.questions));
  }

  /**
   * @description store assessment answer/progress locally
   */
  storeProgress() {
    let answers = {};
    _.forEach(this.formGroup, (question, id) => {
      let values = question.getRawValue();
      answers[id] = {
        assessment_question_id: id,
        answer: values.answer || values.comment
      }
    });

    // final step - save to localstorage
    let assessmentId = 'temporary_fake_id';
    let submission = {
      Assessment: {
          id: assessmentId,
          activity_id: 'temporary_fake_activity_id'
      },
      AssessmentSubmissionAnswer: answers || {}
    };
    console.log(submission);
    this.cache.setLocal(`assessment.group.${assessmentId}`, JSON.stringify(submission));
  }

  /**
   * @description retrieve saved progress from localStorage
   */
  retrieveProgress(questions: Array<any>) {
    let cachedProgress = this.cache.getLocalObject('assessment.group.temporary_fake_id');
    console.log(cachedProgress);

    let newQuestions = questions;
    let progress = cachedProgress.AssessmentSubmissionAnswer;

    if (!_.isEmpty(progress)) {
      _.forEach(newQuestions, (question, id) => {
         newQuestions[id].controls.answer.setValue(progress[id].answer || '');
      });
    }
    // _.forEach(cachedProgress.AssessmentSubmissionAnswer, (answer, id) => {
    //   progress[id] = answer;
    // });
    return newQuestions;
  }

  /**
   * @description initiate save progress and return to previous page/navigation stack
   */
  save() {
    this.storeProgress();
    this.navCtrl.pop();
  }
}
