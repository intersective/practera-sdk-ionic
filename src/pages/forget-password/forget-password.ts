import { Component } from '@angular/core';
import { NavController,
  NavParams,
  ViewController,
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
// pages
import { LoginPage } from '../../pages/login/login';
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
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public translationService: TranslationService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder) {
      this.forgotPwdFormGroup = formBuilder.group({
        email: ['', [FormValidator.isValidEmail, Validators.required]]
      });
    }
  ionViewDidLoad() {}
  userForgotPassword(){
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: this.sendingEmailLoadingMessage
    });

    let defaultMsg = this.sentEmailMessagePartOne + ` ${this.email} ` + this.sentEmailMessagePartTwo;

    loading.present().then(() => {
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
          });
        }
    );
    });
  }
  backButton(){
    this.navCtrl.setRoot(LoginPage); // go back
    // history.back();
    // this.viewCtrl.dismiss();
  }
}
