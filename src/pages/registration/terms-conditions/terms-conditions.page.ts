import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { generalVariableMessages } from '../../../app/messages';
//services
import { TranslationService } from '../../../shared/translation/translation.service';
@Component({
  selector: 'terms-conditions',
  templateUrl: 'terms-conditions.html'
})
export class TermsConditionsPage {
  public helpEmailMessage = generalVariableMessages.helpMail.email;
  constructor(public viewCtrl: ViewController,
    public translationService: TranslationService){}
  dismiss(){
    this.viewCtrl.dismiss();
  }
}