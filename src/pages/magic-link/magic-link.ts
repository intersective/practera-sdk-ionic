import { Component } from '@angular/core';
import { NavController,
         NavParams,
         LoadingController,
         AlertController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
// services
import { AuthService } from '../../services/auth.service';
import { MilestoneService } from '../../services/milestone.service';
import { CacheService } from '../../shared/cache/cache.service';
// pages
import { TabsPage } from '../tabs/tabs.page';
import { LoginPage } from '../login/login';
@Component({
  selector: 'page-magic-link',
  templateUrl: 'magic-link.html'
})
export class MagicLinkPage {
  private verifySuccess = null;
  private auth_token: string;
  public milestone_id: string;
  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private milestoneService: MilestoneService,
    private cacheService: CacheService
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MagiclinkPage');
    this.auth_token = this.navParams.get('auth_token');
  }
  ionViewWillEnter(){
    this.magicLinkAccess();
  }
  magicLinkAccess(){
    let observable = this.authService.magicLinkLogin(this.auth_token);
    const loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Logging in ..'
    });
    loading.present();
    observable.subscribe(data => {
      // localStorage.setItem('isAuthenticated', 'true');
      // this.navCtrl.push(TabsPage);
      // console.log("Successfully logged in");
      this.cacheService.setLocalObject('apikey', data.apikey);
      this.cacheService.setLocalObject('timelineID', data.Timelines[0].Timeline.id);
      this.cacheService.setLocalObject('teams', data.Teams);
      // get milestone data after login
      this.authService.getUser()
        .subscribe(
          data => {
            console.log(data);
          },
          err => {
            console.log(err);
          }
        );
      // get milestone data after login
      this.milestoneService.getMilestones()
        .subscribe(
          data => {
            console.log(data.data[0].id);
            this.milestone_id = data.data[0].id;
            this.cacheService.setLocalObject('milestone_id', data.data[0].id);
            console.log("milestone id: " + data.data[0].id);
            loading.dismiss();
            this.navCtrl.push(TabsPage);
          },
          err => {
            console.log(err);
          }
        )
      this.cacheService.write('isAuthenticated', true);
      this.cacheService.setLocal('isAuthenticated', true);
      },
      err => {
      const failAlert = this.alertCtrl.create({
        title: 'Magic did NOT happen',
        message: 'please login by typing email and password',
        buttons: ['OK']
      });
      failAlert.present();
        this.navCtrl.push(LoginPage);
        // console.log("Login failed");
        this.cacheService.removeLocal('isAuthenticated');
        this.cacheService.write('isAuthenticated', false);
      });
  }
}
