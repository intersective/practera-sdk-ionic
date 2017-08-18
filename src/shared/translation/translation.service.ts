import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { i18nEN } from './assets/i18n-en';
import { i18nCN } from './assets/i18n-cn'; 
@Injectable()
export class TranslationService {
  constructor(public translate: TranslateService,){
    translate.addLangs(["en", "cn"]);
    translate.setDefaultLang("en");
    translate.use("en");
  }
  isTranslated(checkStatus){
    return checkStatus == true ? this.translate.use("cn") : this.translate.use("en")
  }
}