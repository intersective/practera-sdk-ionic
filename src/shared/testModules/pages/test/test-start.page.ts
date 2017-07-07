import { Component, ViewChild, ViewChildren } from '@angular/core';
import { NavController } from 'ionic-angular';

// pages
import { AchievementsViewPage } from '../../../../pages/achievements/view/achievements-view.page';
import { AssessmentsGroupPage } from '../../../../pages/assessments/group/assessments-group.page';
import { ActivitiesClassicListPage } from '../../../../pages/activities-classic/list/activities-classic-list.page';
import { EventsListPage } from '../../../../pages/events/list/list.page';
import { EventsDownloadPage } from '../../../../pages/events/download/events-download.page';
import { GalleryPage } from '../../../../pages/gallery/gallery';
import { HomePage } from '../../../../pages/home/home';
import { LevelsListPage } from '../../../../pages/levels/list/list';
import { LoginPage } from '../../../../pages/login/login';
import { RegistrationPage } from '../../../../pages/registration/registration.page';
import { SettingsPage } from '../../../../pages/settings/settings.page';
import { TeamPage } from '../../../../pages/team/team';

const PAGES = [
  {
    name: 'Multiple Choice Questions',
    page: AssessmentsGroupPage,
    params: {
      assessment: {
        "Assessment": {
            "id": 37,
            "name": "Multiple Option Question",
            "description": "Needs a description...",
            "assessment_type": "quiz",
            "is_live": false,
            "is_team": false,
            "score_type": "numeric",
            "experience_id": 2,
            "program_id": 5,
            "deleted": false,
            "deleted_date": null,
            "comparison_group_size": 3,
            "comparison_group_points": 10,
            "review_period": 72,
            "review_scope": "team",
            "review_scope_id": null,
            "created": "2016-06-23 06:07:39.681326",
            "modified": "2016-06-23 06:07:39.681326",
            "review_instructions": null,
            "is_repeatable": false,
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
        "AssessmentQuestion": [
            {
                "name": "1st Multitple Question",
                "question_type": "multiple",
                "file_type": null,
                "audience": "[\"reviewer\",\"submitter\"]",
                "id": 140,
                "assessment_id": 37
            },
            {
                "name": "2nd Multi Question",
                "question_type": "multiple",
                "file_type": null,
                "audience": "[\"reviewer\",\"submitter\"]",
                "id": 141,
                "assessment_id": 37
            }
        ]
      }
    }
  },
  {
    name: 'Assorted Assessments Questions',
    page: AssessmentsGroupPage,
    params: {
      assessment: {
        Assessment: {
          id:'temporary_fake_id'
        },
        AssessmentQuestion: [
          {
            id: 4,
            question_type: 'file',
            audience: "[\"reviewer\",\"submitter\"]",
            file_type: 'image',
            choices: [],
            answers: {
              submitter: [],
              reviewer: [],
            },
            name: 'TASK: What was actually required of me in that situation?',
            required: true
          },
          {
            id: 5,
            question_type: 'multiple',
            audience: "[\"reviewer\",\"submitter\"]",
            file_type: null,
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
            name: 'Multiple: 3 choices Questions',
            required: true
          },
          {
            id: 1,
            question_type: 'oneof',
            audience: "[\"reviewer\",\"submitter\"]",
            file_type: null,
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
            question_type: 'text',
            audience: "[\"reviewer\",\"submitter\"]",
            file_type: null,
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
            question_type: 'text',
            audience: "[\"reviewer\",\"submitter\"]",
            file_type: null,
            choices: [],
            answers: {
              submitter: [],
              reviewer: [],
            },
            name: 'ACTION: What did I do given the situation and the task?',
            required: true
          }
        ]

      }
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
    name: 'Home Page',
    page: HomePage
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
  },
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
