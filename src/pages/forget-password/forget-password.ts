import { Component } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController,
         ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages'; 
// services
import { AuthService } from '../../services/auth.service';
// directives
import {FormValidator} from '../../validators/formValidator';
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html'
})
export class ForgetPasswordPage {
  email: string;
  forgotPwdFormGroup: any;
  // loading & error message variables
  private sendingEmailLoadingMessage = loadingMessages.SendingEmail.send;
  private sentEmailMessagePartOne = loadingMessages.SentMessage.partOne;
  private sentEmailMessagePartTwo = loadingMessages.SentMessage.partTwo;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public translationService: TranslationService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder) {
      this.forgotPwdFormGroup = formBuilder.group({
        email: ['', [FormValidator.isValidEmail,
                    Validators.required]],
      });
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
  }
  userForgotPassword(){
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
  // logError(error) {
  //   const alert = this.alertCtrl.create({
  //     title: 'Email sent failed ..',
  //     message: error,
  //     buttons: ['Close']
  //   });
  //   alert.present();
  //   // handle API calling errors display with alert controller
  // }
}
