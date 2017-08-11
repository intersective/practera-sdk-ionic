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
import { SpinwheelPage } from '../../../../pages/spinwheel/spinwheel.page';
import { TeamPage } from '../../../../pages/team/team';

const PAGES = [
  {
    name: 'Test',
    page: SpinwheelPage
  },
  {
    name: 'Check-in',
    page: EventCheckinPage,
    params: {
      event: {
        "id": 132,
        "activity_id": 35,
        "start": "2017-04-01 08:15:00",
        "end": "2018-03-16 09:15:00",
        "location": "location",
        "title": "Year long",
        "description": "Test",
        "capacity": 40,
        "remaining_capacity_percentage": 95,
        "remaining_capacity": 38,
        "isBooked": true,
        "files": [],
        "References": [
          {
            "context_id": 44,
            "Assessment": {
              "id": 37,
              "name": "Event Assessment 1",
              "context_id": 44
            }
          }
        ],
        "isAttended": false,
        "startDisplay": "Saturday, Apr 1 at 4:15 PM",
        "activity": {
          "id": 35,
          "milestone_id": 9,
          "name": "Test Event",
          "description": "",
          "lead_image": null,
          "video_url": "",
          "order": null,
          "instructions": "",
          "is_locked": false,
          "start": "2016-10-22 13:00:01",
          "end": "2019-07-18 13:59:59",
          "deadline": "2019-07-18 13:59:59",
          "activity": {
            "id": 35,
            "milestone_id": 9,
            "name": "Test Event",
            "description": "",
            "lead_image": null,
            "video_url": "",
            "order": null,
            "instructions": "",
            "is_locked": false,
            "start": "2016-10-22 13:00:01",
            "end": "2019-07-18 13:59:59",
            "deadline": "2019-07-18 13:59:59"
          },
          "sequence": {
            "id": 77,
            "activity_id": 35,
            "model": "Assess.Assessment",
            "model_id": 37,
            "order": 0,
            "is_locked": false,
            "Assess.Assessment": {
              "id": 37,
              "name": "Event Assessment 1",
              "description": "Needs a description...",
              "assessment_type": "checkin",
              "is_live": true,
              "is_team": false,
              "score_type": "numeric",
              "experience_id": 2,
              "program_id": 4,
              "deleted": false,
              "deleted_date": null,
              "comparison_group_size": 3,
              "comparison_group_points": 10,
              "review_period": 72,
              "review_scope": "team",
              "review_scope_id": null,
              "created": "2016-06-23 06:07:39.681326",
              "modified": "2017-07-25 16:20:27",
              "review_instructions": null,
              "is_repeatable": false,
              "num_reviews": 1,
              "review_type": "single",
              "review_role": "mentor",
              "auto_assign_reviewers": null,
              "parent_id": null,
              "auto_publish_reviews": false,
              "context_id": 43
            },
            "context_id": 43
          },
          "assessment": {
            "id": 37,
            "name": "Event Assessment 1",
            "description": "Needs a description...",
            "assessment_type": "checkin",
            "is_live": true,
            "is_team": false,
            "score_type": "numeric",
            "experience_id": 2,
            "program_id": 4,
            "deleted": false,
            "deleted_date": null,
            "comparison_group_size": 3,
            "comparison_group_points": 10,
            "review_period": 72,
            "review_scope": "team",
            "review_scope_id": null,
            "created": "2016-06-23 06:07:39.681326",
            "modified": "2017-07-25 16:20:27",
            "review_instructions": null,
            "is_repeatable": false,
            "num_reviews": 1,
            "review_type": "single",
            "review_role": "mentor",
            "auto_assign_reviewers": null,
            "parent_id": null,
            "auto_publish_reviews": false,
            "context_id": 43
          },
          "Activity": {
            "id": 35,
            "milestone_id": 9,
            "name": "Test Event",
            "description": "",
            "lead_image": null,
            "video_url": "",
            "order": null,
            "instructions": "",
            "is_locked": false,
            "start": "2016-10-22 13:00:01",
            "end": "2019-07-18 13:59:59",
            "deadline": "2019-07-18 13:59:59",
            "activity": {
              "id": 35,
              "milestone_id": 9,
              "name": "Test Event",
              "description": "",
              "lead_image": null,
              "video_url": "",
              "order": null,
              "instructions": "",
              "is_locked": false,
              "start": "2016-10-22 13:00:01",
              "end": "2019-07-18 13:59:59",
              "deadline": "2019-07-18 13:59:59"
            },
            "sequence": {
              "id": 77,
              "activity_id": 35,
              "model": "Assess.Assessment",
              "model_id": 37,
              "order": 0,
              "is_locked": false,
              "Assess.Assessment": {
                "id": 37,
                "name": "Event Assessment 1",
                "description": "Needs a description...",
                "assessment_type": "checkin",
                "is_live": true,
                "is_team": false,
                "score_type": "numeric",
                "experience_id": 2,
                "program_id": 4,
                "deleted": false,
                "deleted_date": null,
                "comparison_group_size": 3,
                "comparison_group_points": 10,
                "review_period": 72,
                "review_scope": "team",
                "review_scope_id": null,
                "created": "2016-06-23 06:07:39.681326",
                "modified": "2017-07-25 16:20:27",
                "review_instructions": null,
                "is_repeatable": false,
                "num_reviews": 1,
                "review_type": "single",
                "review_role": "mentor",
                "auto_assign_reviewers": null,
                "parent_id": null,
                "auto_publish_reviews": false,
                "context_id": 43
              },
              "context_id": 43
            },
            "assessment": {
              "id": 37,
              "name": "Event Assessment 1",
              "description": "Needs a description...",
              "assessment_type": "checkin",
              "is_live": true,
              "is_team": false,
              "score_type": "numeric",
              "experience_id": 2,
              "program_id": 4,
              "deleted": false,
              "deleted_date": null,
              "comparison_group_size": 3,
              "comparison_group_points": 10,
              "review_period": 72,
              "review_scope": "team",
              "review_scope_id": null,
              "created": "2016-06-23 06:07:39.681326",
              "modified": "2017-07-25 16:20:27",
              "review_instructions": null,
              "is_repeatable": false,
              "num_reviews": 1,
              "review_type": "single",
              "review_role": "mentor",
              "auto_assign_reviewers": null,
              "parent_id": null,
              "auto_publish_reviews": false,
              "context_id": 43
            }
          },
          "ActivitySequence": [
            {
              "id": 77,
              "activity_id": 35,
              "model": "Assess.Assessment",
              "model_id": 37,
              "order": 0,
              "is_locked": false,
              "Assess.Assessment": {
                "id": 37,
                "name": "Event Assessment 1",
                "description": "Needs a description...",
                "assessment_type": "checkin",
                "is_live": true,
                "is_team": false,
                "score_type": "numeric",
                "experience_id": 2,
                "program_id": 4,
                "deleted": false,
                "deleted_date": null,
                "comparison_group_size": 3,
                "comparison_group_points": 10,
                "review_period": 72,
                "review_scope": "team",
                "review_scope_id": null,
                "created": "2016-06-23 06:07:39.681326",
                "modified": "2017-07-25 16:20:27",
                "review_instructions": null,
                "is_repeatable": false,
                "num_reviews": 1,
                "review_type": "single",
                "review_role": "mentor",
                "auto_assign_reviewers": null,
                "parent_id": null,
                "auto_publish_reviews": false,
                "context_id": 43
              },
              "context_id": 43
            }
          ],
          "References": [
            {
              "context_id": 43,
              "Assessment": {
                "id": 37,
                "name": "Event Assessment 1"
              }
            }
          ]
        },
        "coverUrl": "/assets/img/static/event-cover-3.jpg",
        "assessment": {
          "id": 37,
          "name": "Event Assessment 1",
          "context_id": 44
        },
        "context_id": 44
      },
      submissions: [
        {
          "id": 20,
          "submitter_id": 20,
          "created": "2017-07-28 03:05:36",
          "modified": "2017-07-28 03:05:38",
          "status": "in progress",
          "assessment_id": 37,
          "order": null,
          "submitted": null,
          "team_id": null,
          "program_id": 4,
          "activity_id": 132,
          "score": null,
          "moderated_score": "0",
          "publish_date": null,
          "review_score": "0",
          "timeline_id": 5,
          "context_id": 44,
          "assessment": {
            "id": 37,
            "name": "Event Assessment 1",
            "description": "Needs a description...",
            "assessment_type": "checkin",
            "is_live": true,
            "is_team": false,
            "score_type": "numeric",
            "experience_id": 2,
            "program_id": 4,
            "deleted": false,
            "deleted_date": null,
            "comparison_group_size": 3,
            "comparison_group_points": 10,
            "review_period": 72,
            "review_scope": "team",
            "review_scope_id": null,
            "created": "2016-06-23 06:07:39.681326",
            "modified": "2017-07-25 16:20:27",
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
          "answer": [
            {
              "id": 75,
              "assessment_submission_id": 20,
              "comment": null,
              "assessment_question_id": 129,
              "answer": 284,
              "score": "0"
            },
            {
              "id": 76,
              "assessment_submission_id": 20,
              "comment": null,
              "assessment_question_id": 132,
              "answer": {
                "filename": "stuckhere.png",
                "handle": "iALqct8jRSuKhVs3NB8C",
                "mimetype": "image/png",
                "originalPath": "stuckhere.png",
                "size": 195280,
                "source": "local_file_system",
                "url": "https://cdn.filestackcontent.com/iALqct8jRSuKhVs3NB8C",
                "status": "Stored",
                "icon": "fa-image",
                "key": "iALqct8jRSuKhVs3NB8C"
              },
              "score": "0"
            }
          ],
          "review": []
        }
      ]
    }
  },
  {
    name: 'Multiple Choice Questions',
    page: AssessmentsGroupPage,
    params: {
      assessmentGroup: {
        AssessmentGroupQuestion: [
            {
              "id": 140,
              "assessment_group_id": 42,
              "assessment_question_id": 140,
              "order": null,
              "AssessmentQuestion": {
                "id": 140,
                "assessment_id": 37,
                "name": "1st Multitple Question",
                "description": "",
                "hint": "",
                "score": "1",
                "question_type": "multiple",
                "has_comment": false,
                "is_required": true,
                "audience": "[\"reviewer\",\"submitter\"]",
                "answer": null,
                "file_type": null,
                "AssessmentQuestionChoice": [
                  {
                    "id": 283,
                    "assessment_question_id": 140,
                    "assessment_choice_id": 283,
                    "order": 1,
                    "weight": "1",
                    "explanation": null,
                    "AssessmentChoice": {
                      "id": 283,
                      "name": "New Choice 1",
                      "description": ""
                    }
                  },
                  {
                    "id": 284,
                    "assessment_question_id": 140,
                    "assessment_choice_id": 284,
                    "order": 2,
                    "weight": "1",
                    "explanation": null,
                    "AssessmentChoice": {
                      "id": 284,
                      "name": "New Choice 2",
                      "description": ""
                    }
                  },
                  {
                    "id": 285,
                    "assessment_question_id": 140,
                    "assessment_choice_id": 285,
                    "order": 3,
                    "weight": "1",
                    "explanation": null,
                    "AssessmentChoice": {
                      "id": 285,
                      "name": "New Choice 3",
                      "description": ""
                    }
                  }
                ]
              }
            },
            {
              "id": 141,
              "assessment_group_id": 42,
              "assessment_question_id": 141,
              "order": null,
              "AssessmentQuestion": {
                  "id": 141,
                  "assessment_id": 37,
                  "name": "2nd Multi Question",
                  "description": "",
                  "hint": "",
                  "score": "1",
                  "question_type": "multiple",
                  "has_comment": false,
                  "is_required": true,
                  "audience": "[\"reviewer\",\"submitter\"]",
                  "answer": null,
                  "file_type": null,
                  "AssessmentQuestionChoice": [
                      {
                          "id": 286,
                          "assessment_question_id": 141,
                          "assessment_choice_id": 286,
                          "order": 1,
                          "weight": "1",
                          "explanation": null,
                          "AssessmentChoice": {
                              "id": 286,
                              "name": "One of the first",
                              "description": ""
                          }
                      },
                      {
                          "id": 287,
                          "assessment_question_id": 141,
                          "assessment_choice_id": 287,
                          "order": 2,
                          "weight": "1",
                          "explanation": null,
                          "AssessmentChoice": {
                              "id": 287,
                              "name": "2nd ",
                              "description": ""
                          }
                      },
                      {
                          "id": 288,
                          "assessment_question_id": 141,
                          "assessment_choice_id": 288,
                          "order": 3,
                          "weight": "1",
                          "explanation": null,
                          "AssessmentChoice": {
                              "id": 288,
                              "name": "3rd Choice",
                              "description": ""
                          }
                      },
                      {
                          "id": 289,
                          "assessment_question_id": 141,
                          "assessment_choice_id": 289,
                          "order": 4,
                          "weight": "0",
                          "explanation": null,
                          "AssessmentChoice": {
                              "id": 289,
                              "name": "Select me too!",
                              "description": ""
                          }
                      }
                  ]
              }
            }

          ]
        },
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
            "assessment_id": 37,
            "AssessmentQuestionChoice": [
              {
                "id": 286,
                "assessment_question_id": 141,
                "assessment_choice_id": 286,
                "order": 1,
                "weight": "1",
                "explanation": null,
                "AssessmentChoice": {
                    "id": 286,
                    "name": "One of the first",
                    "description": ""
                }
              },
              {
                "id": 287,
                "assessment_question_id": 141,
                "assessment_choice_id": 287,
                "order": 2,
                "weight": "1",
                "explanation": null,
                "AssessmentChoice": {
                    "id": 287,
                    "name": "2nd ",
                    "description": ""
                }
              },
              {
                "id": 288,
                "assessment_question_id": 141,
                "assessment_choice_id": 288,
                "order": 3,
                "weight": "1",
                "explanation": null,
                "AssessmentChoice": {
                    "id": 288,
                    "name": "3rd Choice",
                    "description": ""
                }
              },
              {
                "id": 289,
                "assessment_question_id": 141,
                "assessment_choice_id": 289,
                "order": 4,
                "weight": "0",
                "explanation": null,
                "AssessmentChoice": {
                    "id": 289,
                    "name": "Select me too!",
                    "description": ""
                }
              }
            ]
          }
        ],
        "AssessmentGroup": [
          {
              "id": 42,
              "assessment_id": 37,
              "name": "1st Group",
              "description": "",
              "order": 1,
              "review_instructions": "",
              "restart_numbering": false,
              "AssessmentGroupQuestion": [
              {
                "id": 140,
                "assessment_group_id": 42,
                "assessment_question_id": 140,
                "order": null,
                "AssessmentQuestion": {
                  "id": 140,
                  "assessment_id": 37,
                  "name": "1st Multitple Question",
                  "description": "",
                  "hint": "",
                  "score": "1",
                  "question_type": "multiple",
                  "has_comment": false,
                  "is_required": true,
                  "audience": "[\"reviewer\",\"submitter\"]",
                  "answer": null,
                  "file_type": null,
                  "AssessmentQuestionChoice": [
                    {
                      "id": 283,
                      "assessment_question_id": 140,
                      "assessment_choice_id": 283,
                      "order": 1,
                      "weight": "1",
                      "explanation": null,
                      "AssessmentChoice": {
                        "id": 283,
                        "name": "New Choice 1",
                        "description": ""
                      }
                    },
                    {
                      "id": 284,
                      "assessment_question_id": 140,
                      "assessment_choice_id": 284,
                      "order": 2,
                      "weight": "1",
                      "explanation": null,
                      "AssessmentChoice": {
                        "id": 284,
                        "name": "New Choice 2",
                        "description": ""
                      }
                    },
                    {
                      "id": 285,
                      "assessment_question_id": 140,
                      "assessment_choice_id": 285,
                      "order": 3,
                      "weight": "1",
                      "explanation": null,
                      "AssessmentChoice": {
                        "id": 285,
                        "name": "New Choice 3",
                        "description": ""
                      }
                    }
                  ]
                }
              },
              {
                  "id": 141,
                  "assessment_group_id": 42,
                  "assessment_question_id": 141,
                  "order": null,
                  "AssessmentQuestion": {
                      "id": 141,
                      "assessment_id": 37,
                      "name": "2nd Multi Question",
                      "description": "",
                      "hint": "",
                      "score": "1",
                      "question_type": "multiple",
                      "has_comment": false,
                      "is_required": true,
                      "audience": "[\"reviewer\",\"submitter\"]",
                      "answer": null,
                      "file_type": null,
                      "AssessmentQuestionChoice": [
                          {
                              "id": 286,
                              "assessment_question_id": 141,
                              "assessment_choice_id": 286,
                              "order": 1,
                              "weight": "1",
                              "explanation": null,
                              "AssessmentChoice": {
                                  "id": 286,
                                  "name": "One of the first",
                                  "description": ""
                              }
                          },
                          {
                              "id": 287,
                              "assessment_question_id": 141,
                              "assessment_choice_id": 287,
                              "order": 2,
                              "weight": "1",
                              "explanation": null,
                              "AssessmentChoice": {
                                  "id": 287,
                                  "name": "2nd ",
                                  "description": ""
                              }
                          },
                          {
                              "id": 288,
                              "assessment_question_id": 141,
                              "assessment_choice_id": 288,
                              "order": 3,
                              "weight": "1",
                              "explanation": null,
                              "AssessmentChoice": {
                                  "id": 288,
                                  "name": "3rd Choice",
                                  "description": ""
                              }
                          },
                          {
                              "id": 289,
                              "assessment_question_id": 141,
                              "assessment_choice_id": 289,
                              "order": 4,
                              "weight": "0",
                              "explanation": null,
                              "AssessmentChoice": {
                                  "id": 289,
                                  "name": "Select me too!",
                                  "description": ""
                              }
                          }
                      ]
                  }
                }
              ]
            }
        ],

      }
    }
  },
  {
    name: 'Assorted Assessments Questions',
    page: AssessmentsGroupPage,
    params: {
      assessmentGroup: {
        AssessmentGroupQuestion: [
          {
            AssessmentQuestion: {
              id: 4,
              question_type: 'file',
              audience: "[\"reviewer\",\"submitter\"]",
              file_type: 'image',
              AssessmentQuestionChoice: [],
              answers: {
                submitter: [],
                reviewer: [],
              },
              name: 'TASK: What was actually required of me in that situation?',
              is_required: true
            }
          },
          {
            AssessmentQuestion: {
              id: 5,
              question_type: 'multiple',
              audience: "[\"reviewer\",\"submitter\"]",
              file_type: null,
              AssessmentQuestionChoice: [
                {
                    "id": 1,
                    "assessment_question_id": 5,
                    "assessment_choice_id": 1,
                    "order": 1,
                    "weight": "1",
                    "explanation": null,
                    "AssessmentChoice": {
                        "id": 1,
                        "name": "Test 1",
                        "description": ""
                    }
                },
                {
                    "id": 2,
                    "assessment_question_id": 5,
                    "assessment_choice_id": 2,
                    "order": 2,
                    "weight": "1",
                    "explanation": null,
                    "AssessmentChoice": {
                        "id": 2,
                        "name": "Test 2",
                        "description": ""
                    }
                },
                {
                    "id": 3,
                    "assessment_question_id": 5,
                    "assessment_choice_id": 3,
                    "order": 3,
                    "weight": "1",
                    "explanation": null,
                    "AssessmentChoice": {
                        "id": 3,
                        "name": "Test 3",
                        "description": ""
                    }
                }
              ],
              answers: {
                submitter: [],
                reviewer: [],
              },
              name: 'Multiple: 3 choices Questions',
              is_required: true
            }
          },

          {
            AssessmentQuestion: {

              id: 1,
              question_type: 'oneof',
              audience: "[\"reviewer\",\"submitter\"]",
              file_type: null,
              AssessmentQuestionChoice: [
                {
                    "id": 1,
                    "assessment_question_id": 5,
                    "assessment_choice_id": 1,
                    "order": 1,
                    "weight": "1",
                    "explanation": null,
                    "AssessmentChoice": {
                        "id": 1,
                        "name": "Test 1",
                        "description": ""
                    }
                },
                {
                    "id": 2,
                    "assessment_question_id": 5,
                    "assessment_choice_id": 2,
                    "order": 2,
                    "weight": "1",
                    "explanation": null,
                    "AssessmentChoice": {
                        "id": 2,
                        "name": "Test 2",
                        "description": ""
                    }
                },
                {
                    "id": 3,
                    "assessment_question_id": 5,
                    "assessment_choice_id": 3,
                    "order": 3,
                    "weight": "1",
                    "explanation": null,
                    "AssessmentChoice": {
                        "id": 3,
                        "name": "Test 3",
                        "description": ""
                    }
                }
              ],
              answers: {
                submitter: [],
                reviewer: [],
              },
              name: 'SITUATION: The context in which this experience took place',
              is_required: true
            }
          },
          {
            AssessmentQuestion: {
              id: 2,
              question_type: 'text',
              audience: "[\"reviewer\",\"submitter\"]",
              file_type: null,
              AssessmentQuestionChoice: [],
              answers: {
                submitter: [],
                reviewer: [],
              },
              name: 'TASK: What was actually required of me in that situation?',
              is_required: true
            }
          },
          {
            AssessmentQuestion: {
              id: 3,
              question_type: 'text',
              audience: "[\"reviewer\",\"submitter\"]",
              file_type: null,
              AssessmentQuestionChoice: [],
              answers: {
                submitter: [],
                reviewer: [],
              },
              name: 'ACTION: What did I do given the situation and the task?',
              is_required: true
            }
          }
        ]
      },
      assessment: {
        Assessment: {
          id:'temporary_fake_id'
        },
        AssessmentGroupQuestion: []

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
