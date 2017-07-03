import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

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
  group = [];
  questions = [];
  formGroup: FormGroup;
  temp;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private fb: FormBuilder
  ) {
    /**
      * {
      *     Assessment: {
      *         id: 1,
      *         review_id: 1,
      *         submission_id: 1
      *     },
      *     AssessmentReviewAnswer: [{
      *         assessment_question_id: 1,
      *         answer: 1, // data is depend question type
      *         comment: "example text" // optional based question type (mostly for text question)
      *     },
      *     {
      *         assessment_question_id: 2,
      *         answer: 1 // oneof type question
      *     },
      *     {
      *         assessment_question_id: 3,
      *         answer: {} // file type question
      *     },
      *     {
      *         assessment_question_id: 4,
      *         comment: "text based answer" // text based question
      *     }]
      * }
     */

  }

  formQuestionGroup(questions) {
    let group: any = {};

    console.log('Going to formGroup for', this.questions);
    this.questions.forEach(question => {
      /*
        Assessment: {
          id: 'assessment.id',
          activity_id: 'activity_id'
        },
        AssessmentSubmissionAnswer: [],
      */
      group[question.id] = new FormGroup({
        answer: question.required ? new FormControl(question.answer || '', Validators.required) : new FormControl(question.answer || ''),
        comment: question.required ? new FormControl(question.comment || '', Validators.required) : new FormControl(question.comment || ''),
      });

    });

    return group;
  }

  ionViewDidEnter() {
    this.group = this.navParams.get('groups') || [
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

    this.formGroup = this.formQuestionGroup(this.questions);
  }

  save() {
    console.log(this.formGroup);
    void 0;


    // final step - save to localstorage
    let answer = {
      Assessment: {
          id: 'temporary_fake_id',
          activity_id: 'temporary_fake_activity_id'
      },
      AssessmentSubmissionAnswer: {}
    };
    console.log(answer);
  }
}
