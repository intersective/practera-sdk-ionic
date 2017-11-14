// list of hardcode ids && pre-config data
// from list.page.ts file
const prefixUrl = 'https://api.practera.com/';
const appKey = '69ad1e66dc';
const achievementListIDs = [ // for handling activities ticks data display order
  [355, 402, 353, 354],
  [351, 404, 349, 350],
  [370, 407, 368, 369],
  [344, 403, 342, 343],
  [361, 405, 359, 360],
  [365, 406, 363, 364],
  [341, 341, 341, 341]
];
const newbieOrderedIDs = [ // for handling initialized newbie assessment data display
  [341, 341, 341, 341],
  [355, 402, 353, 354],
  [351, 404, 349, 350],
  [370, 407, 368, 369],
  [344, 403, 342, 343],
  [361, 405, 359, 360],
  [365, 406, 363, 364]
];
const hardcode_assessment_id = 2134; // Reference Model - Assessment: Assessment ID:
const hardcode_context_id = 2532; // Reference Model - Assessment Context ID
// from activities-view.page.ts file
const hardcode_activity_id = 7850; // <Activity ID> is the activity id of career strategist, checking this id to see if all skills activities has been revealed.
const hardcodeAssessmentIds = [2124, 2125, 2126, 2127, 2128, 2129, 2050]; // for handling submitted assessments title display
const hardcodeQuestionIDs = [21316, 21327, 21338, 21349, 21360, 21371, 20661]; // for handling submitted assessments title display
const portfolio_domain = 'assess/assessments/portfolio'; //for handling digital portfolio url
// function of hardcode list data
const HardcodeDataList = () => {
  if(!(window.location.href.indexOf('pe.practera.com') > -1)){ // if not live server, then, go to sandbox hardcode list and pre-config data
    this.prefixUrl = 'https://sandbox.practera.com/';
    this.appKey = '69ad1e66dc';
    this.achievementListIDs = [
      [349, 350, 347, 348],
      [345, 346, 343, 344],
      [361, 362, 359, 360],
      [341, 342, 339, 340],
      [353, 354, 351, 352],
      [357, 358, 355, 356],
      [326, 326, 326, 326]
    ];
    this.newbieOrderedIDs = [
      [326, 326, 326, 326],
      [349, 350, 347, 348],
      [345, 346, 343, 344],
      [361, 362, 359, 360],
      [341, 342, 339, 340],
      [353, 354, 351, 352],
      [357, 358, 355, 356]
    ];
    this.hardcode_assessment_id = 2064;
    this.hardcode_context_id = 2487;
    this.hardcode_activity_id = 7655;
    this.hardcodeAssessmentIds = [2066, 2067, 2068, 2069, 2070, 2071, 2050];
    this.hardcodeQuestionIDs = [20775, 20785, 20795, 20805, 20815, 20825, 20661];
    this.portfolio_domain = `https://sandbox.practera.com/${portfolio_domain}`;
  }else {
    this.prefixUrl = 'https://api.practera.com/';
    this.appKey = '69ad1e66dc';
    this.achievementListIDs = [
      [355, 402, 353, 354],
      [351, 404, 349, 350],
      [370, 407, 368, 369],
      [344, 403, 342, 343],
      [361, 405, 359, 360],
      [365, 406, 363, 364],
      [341, 341, 341, 341]
    ];
    this.newbieOrderedIDs = [
      [341, 341, 341, 341],
      [355, 402, 353, 354],
      [351, 404, 349, 350],
      [370, 407, 368, 369],
      [344, 403, 342, 343],
      [361, 405, 359, 360],
      [365, 406, 363, 364]
    ];
    this.hardcode_assessment_id = 2134;
    this.hardcode_context_id = 2532;
    this.hardcode_activity_id = 7850;
    this.hardcodeAssessmentIds = [2124, 2125, 2126, 2127, 2128, 2129, 2050];
    this.hardcodeQuestionIDs = [21316, 21327, 21338, 21349, 21360, 21371, 20661];
    this.portfolio_domain = `https://www.practera.com/${portfolio_domain}`;
  }
  return {
    filestack: {
      apiKey: 'AO6F4C72uTPGRywaEijdLz'
    },
    prefixUrl: this.prefixUrl,
    appKey: this.appKey,
    achievementListIDs: this.achievementListIDs,
    newbieOrderedIDs: this.newbieOrderedIDs,
    hardcode_assessment_id: this.hardcode_assessment_id,
    hardcode_context_id: this.hardcode_context_id,
    hardcode_activity_id: this.hardcode_activity_id,
    hardcodeAssessmentIds: this.hardcodeAssessmentIds,
    hardcodeQuestionIDs: this.hardcodeQuestionIDs,
    portfolio_domain: this.portfolio_domain
  }
}
export default HardcodeDataList();
