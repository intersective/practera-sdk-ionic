import { Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NavController, AlertController } from 'ionic-angular';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages, generalVariableMessages } from '../../app/messages'; 
// services
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../shared/notification/notification.service';
// pages
import { RegisterPage } from '../registration/register.page';
import { TabsPage } from '../tabs/tabs.page';
@Component({
  selector: 'term-condition',
  templateUrl: 'term-condition.html'
})
export class TermConditionPage {
  @Input('content') content?: SafeResourceUrl;
  @Input('user') user: any;
  agreed:boolean = false;
  public checkAccessMethod: boolean = false;
  // loading & error message variables
  public helpEmailMessage = generalVariableMessages.helpMail.email;
  public disagreeErrMessage = errMessages.TermConditions.disagreement.noAccepted;
  public verifyFailedErrMessage = errMessages.TermConditions.verifyFailed.verifyfailed;
  constructor(
    public nav: NavController,
    public alertCtrl: AlertController,
    public authService: AuthService,
    public notificationService: NotificationService,
    public translationService: TranslationService,
  ) {}
  public accessMethod(){
    return (window.location.href.indexOf('?do=') > -1) ? this.checkAccessMethod = true : this.checkAccessMethod = false
  }
  public displayError(errorMessage?: any): void {
    let alert = this.alertCtrl.create({
      title: 'Invalid registration code',
      subTitle: errorMessage,
      buttons: [{
        text: 'Close'
      }]
    });
    alert.present();
  }
  public backToSAccountPage() {
    this.nav.popToRoot();
  }
  ionViewDidEnter() {
    console.log(this.user);
  }
  agree(user): void {
    if (this.agreed === true) {
      this.nav.push(RegisterPage, user);
    } else {
      this.notificationService.present(this.disagreeErrMessage);
    }
  }
  /**
   * verify if params from url is allowed to proceed with registration
   */
  verify(): void {
    this.authService.verifyRegistration({
      key: 'test',
      password: 'test'
    }).subscribe(
      res => {
        console.log(res);
      },
      err => {
        this.notificationService.present(this.verifyFailedErrMessage);
      },
      () => {
        this.nav.push(TabsPage);
      }
    );
  }
  /**
   * toggle Read & confirm to proceed next registration page
   */
  toggleAgree(): void {
    this.agreed = !this.agreed;
  }
  navToRegister(): void {
    if (this.agreed === true) {
      console.log(this.nav.getViews());
    }
  }
  onTermError(err): void {
    const supportEmail = this.helpEmailMessage;
    if ((err.data || {}).msg) {
      //@TODO: implement error handling
      console.log({title: "Unable to register", template: `Something went wrong, please contact ${supportEmail}.`});
    } else if (err.data.msg.indexOf('already registered') != -1) {
      console.log({
        title: "Account already registered",
        template: "Please log in, or click 'forgot password'"
      });
    } else {
      console.log({
        title: "Invalid registration link",
        template: `Please check your email again, or contact ${supportEmail}`
      });
    }
  }
  // temporary fix for direct signin
  signIn(): void {
    this.nav.push(TabsPage);
  }
}
