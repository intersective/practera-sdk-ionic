import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

// services
import { AuthService } from '../../services/auth.service';
// directives
import { FormValidator } from '../../shared/validators/formValidator';
// Others
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages';

@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html'
})
export class ForgetPasswordPage {
  email: string;
  forgotPwdFormGroup: any;
  // loading & error message variables
  sendingEmailLoadingMessage = loadingMessages.SendingEmail.send;
  sentEmailMessagePartOne = loadingMessages.SentMessage.partOne;
  sentEmailMessagePartTwo = loadingMessages.SentMessage.partTwo;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public translationService: TranslationService,
    public authService: AuthService,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder
  ) {
    this.forgotPwdFormGroup = formBuilder.group({
      email: ['', [FormValidator.isValidEmail,
                  Validators.required]],
    });
  }

  ionViewDidLoad() {
  }

  userForgotPassword() {
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: this.sendingEmailLoadingMessage
    });

    let defaultMsg = this.sentEmailMessagePartOne + ` ${this.email} ` + this.sentEmailMessagePartTwo;

    loading.present();
    // This part is calling post_forget_password() API from backend
    this.authService.forgotPassword(this.email)
      .subscribe(data => {
          loading.dismiss();
          defaultMsg = data.msg || defaultMsg;
          const successSMS = this.toastCtrl.create({
            message: defaultMsg,
            duration: 5000
          });
          successSMS.present();
        },
        error => {
          loading.dismiss();
          // this.logError(error);
          defaultMsg = error.msg || defaultMsg;
          const errorSMS = this.toastCtrl.create({
            message: defaultMsg,
            duration: 5000
          });
          errorSMS.present();
        }
     );
  }
}
