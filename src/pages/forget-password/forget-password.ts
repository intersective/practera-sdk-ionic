import { Component } from '@angular/core';
import { AlertController,
         LoadingController,
         NavController,
         NavParams,
         ToastController,
         ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages';
// services
import { AuthService } from '../../services/auth.service';
// directives
import { FormValidator } from '../../shared/validators/formValidator';
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html'
})
export class ForgetPasswordPage {
  email: string;
  forgotPwdFormGroup: any;
  // loading & error message variables
  public sendingEmailLoadingMessage = loadingMessages.SendingEmail.send;
  public sentEmailMessagePartOne = loadingMessages.SentMessage.partOne;
  public sentEmailMessagePartTwo = loadingMessages.SentMessage.partTwo;
  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public translationService: TranslationService,
    public toastCtrl: ToastController,
    public viewCtrl: ViewController
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
    // defaultMsg is used for display the email sent message after user clicked send button
    let defaultMsg = this.sentEmailMessagePartOne + ` ${this.email} ` + this.sentEmailMessagePartTwo;
    loading.present();
    // This part is calling post_forget_password() API from backend
    this.authService.forgotPassword(this.email)
      .subscribe(data => {
          loading.dismiss().then(() => {
            defaultMsg = data.msg || defaultMsg;
            const successSMS = this.toastCtrl.create({
              message: defaultMsg,
              duration: 5000
            });
            successSMS.present();
            this.forgotPwdFormGroup.reset();
          });
        },
        error => {
          loading.dismiss().then(() => {
            defaultMsg = error.msg || defaultMsg;
            const errorSMS = this.toastCtrl.create({
              message: defaultMsg,
              duration: 5000
            });
            errorSMS.present();
            this.forgotPwdFormGroup.reset();
          });
        }
     );
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
