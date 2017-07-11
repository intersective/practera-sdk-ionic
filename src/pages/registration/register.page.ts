import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, ModalController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { TranslationService } from '../../shared/translation/translation.service';
import { loadingMessages, errMessages } from '../../app/messages'; 
// services
import { CacheService } from '../../shared/cache/cache.service';
import { AuthService } from '../../services/auth.service';
import { MilestoneService } from '../../services/milestone.service';
import { NotificationService } from '../../shared/notification/notification.service';
import { ResponsiveService } from '../../services/responsive.service';
// pages
import { RegistrationModalPage } from './modal';
@Component({
  selector: 'register',
  templateUrl: 'register.html',
})

export class RegisterPage implements OnInit {
  @ViewChild('registrationForm') registrationForm: NgForm;
  user: any = {
    password: null,
    verify_password: null
  };
  submitted: boolean = false;
  private windowHeight: number = window.innerHeight / 3;
  private isLandscaped: boolean = false;
  // loading & error message variables
  private verifyFailedErrMessage = errMessages.Registration.verifyFailed.verifyfailed;
  constructor(
    private navParams: NavParams,
    private notificationService: NotificationService,
    private loading: LoadingController,
    private authService: AuthService,
    private cache: CacheService,
    public translationService: TranslationService,
    private milestone: MilestoneService,
    private ngZone:NgZone,
    private modalCtrl: ModalController,
    private responsiveService: ResponsiveService){}
  ngOnInit() {
  }
  popRegistrationModal() {
    let registerModal = this.modalCtrl.create(RegistrationModalPage, {
      "email": this.navParams.get('email')
    });
    console.log("get email: " + this.navParams.get('email'));
    registerModal.present();
  }
}
