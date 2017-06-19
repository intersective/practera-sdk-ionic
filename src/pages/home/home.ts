import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { NavController } from 'ionic-angular';
import { RequestService } from '../../shared/request/request.service';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private request: RequestService
  ) {
  }
}
