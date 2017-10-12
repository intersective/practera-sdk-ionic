// Need update read me
// Copy file to config.ts
const prefixUrl = () => {
  if(window.location.href.indexOf('pe-stage.practera.com') > -1){
    return 'https://sandbox.practera.com/';
  }else {
    return 'https://api.practera.com/';
  }
};
const appKey = () => {
  if(window.location.href.indexOf('pe-stage.practera.com') > -1){
    return '69ad1e66dc';
  }else {
    return '69ad1e66dc';
  }
};
// list of hardcode ids 
// from list.page.ts file
const achievementListIDs = [
  [355, 402, 353, 354],
  [351, 404, 349, 350],
  [370, 407, 368, 369],
  [344, 403, 342, 343],
  [361, 405, 359, 360],
  [365, 406, 363, 364],
  [341, 341, 341, 341]
];
const newbieOrderedIDs = [
  [341, 341, 341, 341],
  [355, 402, 353, 354],
  [351, 404, 349, 350],
  [370, 407, 368, 369],
  [344, 403, 342, 343],
  [361, 405, 359, 360],
  [365, 406, 363, 364]
];
const hardcode_assessment_id = 2134;
const hardcode_context_id = 2532;
// from activities-view.page.ts file
const hardcode_activity_id = 7850;
const hardcodeAssessmentIds = [2124, 2125, 2126, 2127, 2128, 2129, 2050];
const hardcodeQuestionIDs = [21316, 21327, 21338, 21349, 21360, 21371, 20661];
export default {
  prefixUrl: prefixUrl(),
  appKey: appKey(),
  filestack: {
    apiKey: 'AO6F4C72uTPGRywaEijdLz'
  },
  achievementListIDs,
  newbieOrderedIDs,
  hardcode_assessment_id,
  hardcode_context_id,
  hardcode_activity_id,
  hardcodeAssessmentIds,
  hardcodeQuestionIDs
}
