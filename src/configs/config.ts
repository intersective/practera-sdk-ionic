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
export default {
  prefixUrl: prefixUrl(),
  appKey: appKey(),
  filestack: {
    apiKey: 'AO6F4C72uTPGRywaEijdLz'
  }
}
