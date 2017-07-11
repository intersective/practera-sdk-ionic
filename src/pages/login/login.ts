import { ModalController } from 'ionic-angular';
import { Component, NgZone, OnInit } from '@angular/core';
import { TranslationService } from '../../shared/translation/translation.service';
// services
import { ResponsiveService } from '../../services/responsive.service';
// pages
import { LoginModalPage } from '../../pages/login-modal/login-modal';
/* This page is for handling user login process */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private windowHeight: number = window.innerHeight / 3;
  private isLandscaped: boolean = false;
  constructor(
    private modalCtrl: ModalController,
    public translationService: TranslationService,
    private ngZone: NgZone,
    private responsiveService: ResponsiveService
  ){}
  ngOnInit() {
  }
  ionViewDidLoad(){
  }
  popLoginModal() {
    let loginModal = this.modalCtrl.create(LoginModalPage);
    loginModal.present();
  }
}
