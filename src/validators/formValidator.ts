import { FormControl } from '@angular/forms';

export class FormValidator {
  static isValidEmail(formCtrl: FormControl){
    var regexValue = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formCtrl.value);
    if(regexValue) {
      return null;
    }
    return { "inValidEmail": true }
  }
}
