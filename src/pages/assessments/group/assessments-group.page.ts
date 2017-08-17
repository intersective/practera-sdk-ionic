import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { CacheService } from '../../../shared/cache/cache.service';
import { AssessmentService } from '../../../services/assessment.service';

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

export class Choices<T> {
  id: number;
  value: number; // or choice id, usually same as "id" above
  name: string;
  description?: string;
  explanation?: string;
  order?: number;
  weight?: number;
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
    private cache: CacheService,
    private assessmentService: AssessmentService
  ) {
  }

  ionViewDidEnter() {
    this.activity = this.navParams.get('activity') || {};
    this.assessment = this.navParams.get('assessment') || {};

    this.questions = this.normaliseQuestions(this.assessment.AssessmentQuestion);
    this.formGroup = this.retrieveProgress(this.buildFormGroup(this.questions));
  }

  /**
   * turn a collection of questions into angular's FormGroup to share among components
   * @param {array} questions list of questions from a question group (Assessment group)
   */
  buildFormGroup = (questions) => {
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

    console.log('this.questions', this.questions)

    this.formGroup = this.retrieveProgress(this.formQuestionGroup(this.questions));
  }

  /**
   * @description store assessment answer/progress locally
   */
  storeProgress = () => {
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
  };

  /**
   * @description retrieve saved progress from localStorage
   */
  retrieveProgress = (questions: Array<any>) => {
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
  };

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
  private normaliseQuestions = (questions) => {
    let result = [];

    questions.forEach((question) => {
      // let thisQuestion = question['Assess.Assessment'];

      let choices = (question.AssessmentQuestionChoice) ? this.normaliseChoices(question.AssessmentQuestionChoice) : question.choices;

      let normalised: QuestionBase<any> = {
        id: question.id,
        assessment_id: question.assessment_id,
        name: question.name,
        type: question.question_type,
        audience: question.audience,
        file_type: question.file_type,
        choices: choices || []
      };

      result.push(normalised);
    });

    return result;
  };

  /* turn raw API respond format from:
    {
      "id": 123,
      "assessment_question_id": 124,
      "assessment_choice_id": 123,
      "order": 1,
      "weight": "1",
      "explanation": null,
      "AssessmentChoice": {
          "id": 123,
          "name": "Testing name",
          "description": "Testing description"
      }
    }

    to Choices type format:
    {
      "id": 123,
      "value": 123, // or choice id
      "name": "Testing name",
      "description": "Testing description",
      "explanation": null,
      "order": 1,
      "weight": "1"
    }
   */
  private normaliseChoices = (assessmentQuestionChoice) => {
    let results: Choices<any>[] = [];
    assessmentQuestionChoice.forEach(choice => {
      let assessmentChoice = choice.AssessmentChoice;
      results.push({
        id: choice.id,
        value: choice.assessment_choice_id, // or choice id
        name: assessmentChoice.name,
        description: assessmentChoice.description,
        explanation: choice.explanation,
        order: choice.order,
        weight: choice.weight
      });
    });

    return results;
  };

  /**
   * @description initiate save progress and return to previous page/navigation stack
   */
  save() {
    this.storeProgress();
    this.navCtrl.pop();
  }
}
