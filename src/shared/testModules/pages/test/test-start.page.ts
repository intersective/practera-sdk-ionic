import { Component, ViewChild, ViewChildren } from '@angular/core';
import { NavController } from 'ionic-angular';

// pages
import { AchievementsViewPage } from '../../../../pages/achievements/view/achievements-view.page';
import { AssessmentsGroupPage } from '../../../../pages/assessments/group/assessments-group.page';
import { ActivitiesClassicListPage } from '../../../../pages/activities-classic/list/activities-classic-list.page';
import { EventsListPage } from '../../../../pages/events/list/list.page';
import { EventsDownloadPage } from '../../../../pages/events/download/events-download.page';
import { GalleryPage } from '../../../../pages/gallery/gallery';
import { LevelsListPage } from '../../../../pages/levels/list/list';
import { LoginPage } from '../../../../pages/login/login';
import { RegistrationPage } from '../../../../pages/registration/registration.page';
import { SettingsPage } from '../../../../pages/settings/settings.page';
import { EventCheckinPage } from '../../../../pages/events/checkin/event-checkin.page';
import { TeamPage } from '../../../../pages/team/team';

const activity = {
  "id": 35,
  "milestone_id": 11,
  "name": "Activity 1",
  "description": "",
  "lead_image": null,
  "video_url": "",
  "order": null,
  "instructions": "",
  "is_locked": false,
  "start": "2017-07-29 14:00:02",
  "end": "2018-07-24 13:59:59",
  "deadline": "2018-07-24 13:59:59",
  "activity": {
    "id": 35,
    "milestone_id": 11,
    "name": "Activity 1",
    "description": "",
    "lead_image": null,
    "video_url": "",
    "order": null,
    "instructions": "",
    "is_locked": false,
    "start": "2017-07-29 14:00:02",
    "end": "2018-07-24 13:59:59",
    "deadline": "2018-07-24 13:59:59"
  },
  "sequence": {
    "id": 74,
    "activity_id": 35,
    "model": "Assess.Assessment",
    "model_id": 32,
    "order": 0,
    "is_locked": false,
    "Assess.Assessment": {
      "id": 32,
      "name": "Test Assessment - ACT 1",
      "description": "ACT - 1 Assessment Description",
      "assessment_type": "moderated",
      "is_live": true,
      "is_team": false,
      "score_type": "numeric",
      "experience_id": 3,
      "program_id": 6,
      "deleted": false,
      "deleted_date": null,
      "comparison_group_size": 3,
      "comparison_group_points": 10,
      "review_period": 72,
      "review_scope": "team",
      "review_scope_id": null,
      "created": "2016-06-23 06:07:39.681326",
      "modified": "2017-08-04 08:14:21",
      "review_instructions": null,
      "is_repeatable": true,
      "num_reviews": 1,
      "review_type": "single",
      "review_role": "mentor",
      "auto_assign_reviewers": null,
      "parent_id": null,
      "auto_publish_reviews": false,
      "context_id": 40
    },
    "context_id": 40
  },
  "assessment": {
    "id": 32,
    "name": "Test Assessment - ACT 1",
    "description": "ACT - 1 Assessment Description",
    "assessment_type": "moderated",
    "is_live": true,
    "is_team": false,
    "score_type": "numeric",
    "experience_id": 3,
    "program_id": 6,
    "deleted": false,
    "deleted_date": null,
    "comparison_group_size": 3,
    "comparison_group_points": 10,
    "review_period": 72,
    "review_scope": "team",
    "review_scope_id": null,
    "created": "2016-06-23 06:07:39.681326",
    "modified": "2017-08-04 08:14:21",
    "review_instructions": null,
    "is_repeatable": true,
    "num_reviews": 1,
    "review_type": "single",
    "review_role": "mentor",
    "auto_assign_reviewers": null,
    "parent_id": null,
    "auto_publish_reviews": false,
    "context_id": 40
  },
  "Activity": {
    "id": 35,
    "name": "Activity 1",
    "description": ""
  },
  "ActivitySequence": [
    {
      "id": 74,
      "activity_id": 35,
      "model": "Assess.Assessment",
      "model_id": 32,
      "order": 0,
      "is_locked": false,
      "Assess.Assessment": {
        "id": 32,
        "name": "Test Assessment - ACT 1",
        "description": "ACT - 1 Assessment Description",
        "assessment_type": "moderated",
        "is_live": true,
        "is_team": false,
        "score_type": "numeric",
        "experience_id": 3,
        "program_id": 6,
        "deleted": false,
        "deleted_date": null,
        "comparison_group_size": 3,
        "comparison_group_points": 10,
        "review_period": 72,
        "review_scope": "team",
        "review_scope_id": null,
        "created": "2016-06-23 06:07:39.681326",
        "modified": "2017-08-04 08:14:21",
        "review_instructions": null,
        "is_repeatable": true,
        "num_reviews": 1,
        "review_type": "single",
        "review_role": "mentor",
        "auto_assign_reviewers": null,
        "parent_id": null,
        "auto_publish_reviews": false,
        "context_id": 40
      },
      "context_id": 40
    }
  ],
  "References": [
    {
      "context_id": 40,
      "Assessment": {
        "id": 32,
        "name": "Test Assessment - ACT 1"
      }
    }
  ],
  "badges": []
};

const assessmentGroup = {
  "id": 31,
  "assessment_id": 32,
  "name": "Group - 1",
  "description": "Group - 1 Description",
  "questions": [
    {
      "id": 105,
      "assessment_id": 105,
      "question_id": 105,
      "group_id": 31,
      "name": "Text",
      "type": "text",
      "audience": "[\"reviewer\",\"submitter\"]",
      "file_type": null,
      "required": false,
      "choices": [],
      "order": null,
      "answer": {
        "id": 51,
        "assessment_submission_id": 18,
        "comment": null,
        "assessment_question_id": 105,
        "answer": "awd",
        "score": "0"
      },
      "reviewerAnswer": null
    },
    {
      "id": 106,
      "assessment_id": 106,
      "question_id": 106,
      "group_id": 31,
      "name": "Oneof",
      "type": "oneof",
      "audience": "[\"reviewer\",\"submitter\"]",
      "file_type": null,
      "required": true,
      "choices": [
        {
          "id": 284,
          "value": 284,
          "name": "Correct",
          "description": "",
          "explanation": null,
          "order": 1,
          "weight": "1"
        },
        {
          "id": 285,
          "value": 285,
          "name": "Wrong",
          "description": "",
          "explanation": null,
          "order": 2,
          "weight": "0"
        },
        {
          "id": 286,
          "value": 286,
          "name": "Wrong",
          "description": "",
          "explanation": null,
          "order": 3,
          "weight": "0"
        }
      ],
      "order": null,
      "answer": {
        "id": 52,
        "assessment_submission_id": 18,
        "comment": null,
        "assessment_question_id": 106,
        "answer": 285,
        "score": "0"
      },
      "reviewerAnswer": null
    },
    {
      "id": 116,
      "assessment_id": 116,
      "question_id": 116,
      "group_id": 38,
      "name": "File",
      "type": "file",
      "audience": "[\"reviewer\",\"submitter\"]",
      "file_type": "any",
      "required": false,
      "choices": [],
      "order": null,
      "answer": null,
      "reviewerAnswer": null
    }
  ],
  "order": 1,
  "submission": {
    "id": 18,
    "submitter_id": 3555,
    "created": "2017-08-17T03:11:32.000Z",
    "modified": "2017-08-17T03:12:07.000Z",
    "status": "pending review",
    "assessment_id": 32,
    "order": null,
    "submitted": "2017-08-17T03:12:25.000Z",
    "team_id": null,
    "program_id": 6,
    "activity_id": 35,
    "score": "0",
    "moderated_score": "0",
    "publish_date": null,
    "review_score": "0",
    "timeline_id": 8,
    "context_id": 40,
    "assessment": {
      "id": 32,
      "name": "Test Assessment - ACT 1",
      "description": "ACT - 1 Assessment Description",
      "assessment_type": "moderated",
      "is_live": true,
      "is_team": false,
      "score_type": "numeric",
      "experience_id": 3,
      "program_id": 6,
      "deleted": false,
      "deleted_date": null,
      "comparison_group_size": 3,
      "comparison_group_points": 10,
      "review_period": 72,
      "review_scope": "team",
      "review_scope_id": null,
      "created": "2016-06-23 06:07:39.681326",
      "modified": "2017-08-04 08:14:21",
      "review_instructions": null,
      "is_repeatable": true,
      "num_reviews": 1,
      "review_type": "single",
      "review_role": "mentor",
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
    "answer": [
      {
        "id": 51,
        "assessment_submission_id": 18,
        "comment": null,
        "assessment_question_id": 105,
        "answer": "awd",
        "score": "0"
      },
      {
        "id": 52,
        "assessment_submission_id": 18,
        "comment": null,
        "assessment_question_id": 106,
        "answer": 285,
        "score": "0"
      }
    ],
    "review": []
  },
  "totalRequiredQuestions": 1,
  "answeredQuestions": 1,
  "reviewerFeedback": 0,
  "status": "completed"
};
const PAGES = [
  {
    name: 'File Picker Assessment',
    page: AssessmentsGroupPage,
    params: {
      assessmentGroup: assessmentGroup,
      activity: activity
    }
  },
  {
    name: 'Events',
    page: EventsListPage
  },
  {
    name: 'Events Download',
    page: EventsDownloadPage
  },
  {
    name: 'Registration',
    page: RegistrationPage
  },
  {
    name: 'Gallery',
    page: GalleryPage
  },
  {
    name: 'Login',
    page: LoginPage
  },
  {
    name: 'Activities',
    page: ActivitiesClassicListPage
  },
  {
    name: 'Levels',
    page: LevelsListPage
  },
  {
    name: 'Teams',
    page: TeamPage
  },
  {
    name: 'Setting',
    page: SettingsPage
  },
  {
    name: 'Achievement View',
    page: AchievementsViewPage
  }
];

@Component({
  selector: 'my-test',
  templateUrl: 'test.html'
})
export class TestStartPage {
  items: Array<any> = PAGES;

  testPage;

  constructor(public nav: NavController) {
    // console.log('ActivitiesClassicListPage', ActivitiesClassicListPage)
    // console.log('??', ActivitiesClassicListPage);
  }

  goTo(nav) {
    this.testPage = nav.page;

    this.nav.push(nav.page, nav.params || null);
  }
}
