import { Component, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NavController, AlertController } from 'ionic-angular';
import { RegisterPage } from '../registration/register.page';
import { TabsPage } from '../tabs/tabs.page';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'term-condition',
  templateUrl: 'term-condition.html'
})

export class TermConditionPage {
  @Input('content') content?: SafeResourceUrl;
  @Input('user') user: any;

  agreed:boolean = false;

  constructor(
    public nav: NavController,
    private authService: AuthService,
    private notificationService: NotificationService,
    private alertCtrl: AlertController
  ) {}

  private displayError(errorMessage?: any): void {
    let alert = this.alertCtrl.create({
      title: 'Invalid registration code',
      subTitle: errorMessage,
      buttons: [{
        text: 'OK'
      }]
    });

    alert.present();
  }

  ionViewDidEnter() {
    console.log(this.user);
  }

  agree(user): void {
    if (this.agreed === true) {
      this.nav.push(RegisterPage, user);
    } else {
      this.notificationService.present('Agreement is required for further registration process.');
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
        this.notificationService.present('Something is wrong with the registration verification.');
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
    const supportEmail = 'help@support.com';

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
