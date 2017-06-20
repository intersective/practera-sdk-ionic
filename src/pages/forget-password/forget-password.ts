import { Component } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController,
         ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
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
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
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
      content: 'Sending email to us ..'
    });

    let defaultMsg = `We have sent an email to ${this.email} with a link to log into the system - please check your inbox. If you haven't received an email in a few minutes please check the address you entered and your spam folder.`;

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
