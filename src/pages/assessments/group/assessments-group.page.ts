import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
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
  id: number;
  assessment_id: number;
  name: string;
  type: string;
  file_type?: string;
  audience: Array<any>;
  choices?: ChoiceBase<any>[];
  answers?: {
    submitter: AnswerBase<any>[],
    reviewer: AnswerBase<any>[],
  };
  required?: boolean;
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

  ionViewDidEnter() {
    this.activity = this.navParams.get('activity') || {};
    this.assessment = this.navParams.get('assessment') || {
      "Assessment": {
        "id": 29,
        "name": "Check-in 1",
        "description": "Needs a description...",
        "assessment_type": "checkin",
        "is_live": true,
        "is_team": false,
        "score_type": "numeric",
        "experience_id": 2,
        "program_id": 5,
        "deleted": false,
        "deleted_date": null,
        "comparison_group_size": 3,
        "comparison_group_points": 10,
        "review_period": 72,
        "review_scope": "assessment",
        "review_scope_id": null,
        "created": "2016-06-23 06:07:39.681326",
        "modified": "2017-03-09 00:18:25",
        "review_instructions": null,
        "is_repeatable": false,
        "num_reviews": null,
        "review_type": null,
        "review_role": null,
        "visibility": {
          "guest": false,
          "participant": true,
          "mentor": true,
          "coordinator": true,
          "admin": false,
          "team": false,
          "sysadmin": false
        },
        "auto_assign_reviewers": null,
        "parent_id": null,
        "auto_publish_reviews": false
      },
      "AssessmentQuestion": [
        {
          "name": "Selfie",
          "question_type": "file",
          "file_type": "image",
          "audience": "[\"reviewer\",\"submitter\"]",
          "id": 100,
          "assessment_id": 29
        }
      ]
    };

    this.questions = this.normaliseQuestions(this.assessment.AssessmentQuestion);
    this.formGroup = this.retrieveProgress(this.buildFormGroup(this.questions));
  }

  /**
   * turn a collection of questions into angular's FormGroup to share among components
   * @param {array} questions list of questions from a question group (Assessment group)
   */
  buildFormGroup(questions) {
    let result: any = {};

    this.questions.forEach(question => {
      let group = {
        answer: question.required ? new FormControl(question.answer || '', Validators.required) : new FormControl(question.answer || ''),
        comment: question.required ? new FormControl(question.comment || '', Validators.required) : new FormControl(question.comment || '')
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
  }

  /**
   * @TODO: confirm with backend how checkbox value submission is handled
   * @description format checkbox value before post back to server
   */
  getCheckboxValues(choices) {
    let result = {};
    choices
    return result;
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
        answer: values.answer || values.comment,
      };

      // store it if choice answer is available or skip
      if (values.choices) {
        answers[id].choices = values.choices;
      }
    });

    // final step - save to localstorage
    let assessmentId = this.assessment.Assessment.id;
    let submission = {
      Assessment: {
          id: assessmentId,
          activity_id: this.activity.id || 'temporary_fake_activity_id'
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
    let cachedProgress = this.cache.getLocalObject(`assessment.group.${this.assessment.Assessment.id}`);

    let newQuestions = questions;
    let savedProgress = cachedProgress.AssessmentSubmissionAnswer;

    if (!_.isEmpty(savedProgress)) {
      _.forEach(newQuestions, (question, id) => {
        if (savedProgress[id]) {
          newQuestions[id] = this.setValueWith(question, savedProgress[id]);
        }
      });
    }
    return newQuestions;
  }

  /**
   * @description set value to each FormControl for different answer field
   *              - "text", "oneof" & "file" using just "answer" field
   *              - "multiple" answer is stored into "choices" FormControl instead
   * @param {FormGroup} question FormGroup for a question
   * @param {Object} answers answer [choices object || string answer]
   */
  private setValueWith(question, answers) {
    if (answers.choices) {
      question.controls.choices.setValue(answers.choices);
    } else {
      question.controls.answer.setValue(answers.answer || '');
    }
    return question;
  }

  normaliseQuestions(questions) {
    let result = [];

    questions.forEach((question) => {
      // let thisQuestion = question['Assess.Assessment'];
      let normalised: QuestionBase<any> = {
        id: question.id,
        assessment_id: question.assessment_id,
        name: question.name,
        type: question.question_type,
        audience: question.audience,
        file_type: question.file_type,
        choices: question.choices // @TODO: correct this after get_assessment format is final
      };

      result.push(normalised);
    });

    return result;
  }

  /**
   * @description initiate save progress and return to previous page/navigation stack
   */
  save() {
    this.storeProgress();
    this.navCtrl.pop();
  }
}
