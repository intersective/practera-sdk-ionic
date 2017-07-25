import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';

class Assessment {
  id: number;
  context_id: number;
  in_progress?: Boolean;
}

class Answer {
  assessment_question_id: number;
  answer: String | Object | Array<any>;
  choices?: Array<any>;
}

export class ChoiceBase<T> {
  id: number;
  value?: number; // or choice id, usually same as "id" above
  name: string;
  description?: string;
  explanation?: string;
  order?: number;
  weight?: number;
}

export class QuestionBase<T> {
  id: number;
  assessment_id: number;
  name: string;
  type: string;
  file_type?: string;
  audience: Array<any>;
  choices?: ChoiceBase<any>[];
  answer?: any;
  required?: boolean;

  constructor(id, assessment_id, name, type) {
    this.id = id;
    this.assessment_id = assessment_id;
    this.name = name;
    this.type = type;
  }
}

export class Submission {
  Assessment: Assessment;
  AssessmentSubmission?: any;
  AssessmentSubmissionAnswer: Object;
}

@Injectable()
export class AssessmentService {
  constructor(private request: RequestService) {}

  // listAll()
  public getAll(options?: any) {
    return this.request.get('api/assessments.json', options);
  }

  /**
   * get question's details
   * example:
   *   - for multiple-type question, checkbox data is not available in
   *     ActivitySequences (from get_activities API) and get_assessments API
   *   - checkbox values (selected checkbox ids are required for post_assessments API) which
   *     they are only available in this get_export_assessments api
   *
   * @param {any} options [description]
   */
  public getQuestion(options?: any) {
    return this.request.get('api/export_assessments.json', options);
  }

  public post(assessmentAnswer: Submission) {
    return this.request.post('api/assessment_submissions.json', assessmentAnswer, {
      'Content-Type': 'application/json'
    });
  }

  /**
   * save progress using "post" function AssessmentService.post()
   * @param {Object} assessmentAnswer
   */
  public save(assessmentAnswer) {
    assessmentAnswer.Assessment.in_progress = true; // force in_progress
    console.log(assessmentAnswer);
    return this.post(assessmentAnswer);
  }

  /**
   * submit using "post" function AssessmentService.post()
   * @param {Object} assessmentAnswer
   */
  public submit(assessmentAnswer) {
    return this.post(assessmentAnswer);
  }

  /*
    Turn API format from:
    {
      "Assessment": {
        "id": 29,
        "name": "Check-in 1",
        "description": "Needs a description...",
        "assessment_type": "checkin",
        "is_team": false,
        "is_repeatable": false
      },
      "AssessmentGroup": [
        {
          "id": 28,
          "name": "Group 1",
          "description": "",
          "order": 1,
          "assessment_id": 29,
          "AssessmentGroupQuestion": [
            {
              "assessment_question_id": 100,
              "order": null,
              "id": 100,
              "assessment_group_id": 28,
              "AssessmentQuestion": {
                  "id": 100,
                  "name": "Selfie",
                  "description": "",
                  "question_type": "file",
                  "file_type": "image",
                  "is_required": false,
                  "audience": "[\"reviewer\",\"submitter\"]",
                  "AssessmentQuestionChoice": []
              }
            },
            ...
          ]
        }
      ]
    }

    Into:
    {
      "id": 29,
      "name": "Check-in 1",
      "description": "Needs a description...",
      "assessment_type": "checkin",
      "is_team": false,
      "is_repeatable": false
      "groups": {
        "id": 28,
        "name": "Group 1",
        "description": "",
        "order": 1,
        "assessment_id": 29,
        "questions": [
          {
            "id": 100,
            "assessment_question_id": 100,
            "assessment_group_id": 28,
            "name": "Selfie",
            "description": "",
            "question_type": "file",
            "file_type": "image",
            "is_required": false,
            "audience": "[\"reviewer\",\"submitter\"]",
            "AssessmentQuestionChoice": []
            "order": null,
          },
          ...
        ]
      }
    }
   */
  public normalise(assessment) {
    let result = assessment.Assessment;
    let thisGroups = assessment.AssessmentGroup;

    thisGroups = thisGroups.map(group => {
      return this.normaliseGroup(group);
    });

    return {
      id: assessment.id,
      name: assessment.name,
      description: assessment.description,
      assessment_type: assessment.assessment_type,
      is_team: assessment.is_team,
      is_repeatable: assessment.is_repeatable,
      AssessmentGroup: thisGroups
    };
  }

  /*
    turn "AssessmentGroup" object format from:
    {
      "id": 28,
      "name": "Group 1",
      "description": "",
      "order": 1,
      "assessment_id": 29,
      "AssessmentGroupQuestion": [
        {
          "assessment_question_id": 100,
          "order": null,
          "id": 100,
          "assessment_group_id": 28,
          "AssessmentQuestion": {
              "id": 100,
              "name": "Selfie",
              "description": "",
              "question_type": "file",
              "file_type": "image",
              "is_required": false,
              "audience": "[\"reviewer\",\"submitter\"]",
              "questions": []
          }
        },
        ...
      ]
    }

    into format:
    {
      id: group.id,
      name: group.name,
      description: group.description,
      assessment_id: group.assessment_id,
      order: group.order
      questions: [
        {
          "id": 100,
          "assessment_group_id": 28,
          "assessment_question_id": 100,
          "name": "Selfie",
          "description": "",
          "question_type": "file",
          "file_type": "image",
          "is_required": false,
          "audience": "[\"reviewer\",\"submitter\"]",
          "choices": []
          "order": null,
        },
        ...
      ],
    }
   */
  public normaliseGroup(group) {
    // let result = group;
    let thisQuestions = group.AssessmentGroupQuestion;
    thisQuestions = thisQuestions.map(question => {
      return this.normaliseQuestion(question);
    });

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      assessment_id: group.assessment_id,
      questions: thisQuestions,
      order: group.order,
    }
  }

  /*
    turn "AssessmentGroupQuestion" array format from:
    {
      "assessment_question_id": 100,
      "order": null,
      "id": 100,
      "assessment_group_id": 28,
      "AssessmentQuestion": {
        "id": 100,
        "name": "Selfie",
        "description": "",
        "question_type": "file",
        "file_type": "image",
        "is_required": false,
        "audience": "[\"reviewer\",\"submitter\"]",
        "questions": []
      }
    }

    into:
    {
      "id": 100,
      "assessment_group_id": 28,
      "assessment_question_id": 100,
      "name": "Selfie",
      "description": "",
      "question_type": "file",
      "file_type": "image",
      "is_required": false,
      "audience": "[\"reviewer\",\"submitter\"]",
      "choices": []
      "order": null,
    }
   */
  public normaliseQuestion(question) {
    let thisQuestion = question.AssessmentQuestion;
    let thisChoices = thisQuestion.AssessmentQuestionChoice;

    thisChoices = thisChoices.map(choice => {
      return this.normaliseChoice(choice);
    });

    return {
      id: question.id,
      assessment_question_id: question.assessment_question_id,
      assessment_group_id: question.assessment_group_id,
      name: thisQuestion.name,
      question_type: thisQuestion.question_type,
      file_type: thisQuestion.file_type,
      is_required: thisQuestion.is_required,
      audience: thisQuestion.audience,
      choices: thisChoices,
      order: question.order
    };
  }

  /*
    turn "AssessmentQuestionChoice" array format from:
    {
      "order": 1,
      "weight": "1",
      "explanation": null,
      "assessment_choice_id": 275,
      "id": 275,
      "assessment_question_id": 104,
      "AssessmentChoice": {
        "id": 275,
        "name": "New Choice 1",
        "description": "bad"
      }
    }

    into:
    {
      "id": 275,
      "value": 275, // or choice id, usually same as "id" above
      "name": "New Choice 1",
      "description": "bad",
      "explanation": null,
      "order": 1,
      "weight": "1",
    }
   */
  public normaliseChoice(choice) {
    return {
      id: choice.id, // same as assessment_choice_id & AssessmentChoice.id & id
      value: choice.assessment_choice_id,
      name: choice.name,
      description: choice.description,
      explanation: choice.explanation,
      order: choice.order,
      weight: choice.weight
    };
  }
}
