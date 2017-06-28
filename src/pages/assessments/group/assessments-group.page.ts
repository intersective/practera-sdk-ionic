import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
@Component({
  templateUrl: './assessments-group.html',
})

export class AssessmentsGroupPage {
  groups = [];
  questions = [];

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController
  ) {}

  ionViewDidEnter() {
    this.groups = this.navParams.get('groups') || [
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
        type: 'oneof',
        choices: [],
        answers: {
          submitter: [],
          reviewer: [],
        },
        name: 'SITUATION: The context in which this experience took place',
        required: true
      },
      {
        type: 'oneof',
        choices: [],
        answers: {
          submitter: [],
          reviewer: [],
        },
        name: 'TASK: What was actually required of me in that situation?',
        required: true
      },
      {
        type: 'oneof',
        choices: [],
        answers: {
          submitter: [],
          reviewer: [],
        },
        name: 'ACTION: What did I do given the situation and the task?',
        required: true
      },
      /*{
        type: 'file',
        choices: [],
        answers: {
          submitter: [],
          reviewer: [],
        },
        name: 'TASK: What was actually required of me in that situation?'
      },*/
      /*{
        type: 'text',
        choices: [],
        answers: {
          submitter: [],
          reviewer: [],
        },
        name: 'ACTION: What did I do given the situation and the task?'
      }*/
    ];
  }
}
