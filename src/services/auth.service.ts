import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
// Others
import { RequestService } from '../shared/request/request.service';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  public appkey: any = this.request.getAppkey();
  public prefixUrl: any = this.request.getPrefixUrl();
  public AUTH_ENDPOINT: any = 'api/auths.json?action=';
  constructor(
    public request: RequestService,
    public http: Http
  ) {}
  verifyRegistration(data) {
    let urlSearchParams = new URLSearchParams([
      `email=${data.email}`,
      `key=${data.key}`
    ].join('&'));
    return this.request.post(this.AUTH_ENDPOINT+'verify_registration', urlSearchParams);
  }
  register(data) {
    let urlSearchParams = new URLSearchParams([
      `password=${data.password}`,
      `user_id=${data.user_id}`,
      `key=${data.key || 'thisissamplekey'}`
    ].join('&'));
    return this.request.post(this.AUTH_ENDPOINT+'registration', urlSearchParams);
  }
  loginAuth(email, password) {
    let urlSearchParams = new URLSearchParams([
      `data[User][email]=${email}`,
      `data[User][password]=${password}`
    ].join('&'));
    return this.request.post(this.AUTH_ENDPOINT+'authentication', urlSearchParams);
  }
  forgotPassword(email){
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('email', email);
    return this.request.post(this.AUTH_ENDPOINT+'forgot_password', urlSearchParams);
  }
  verifyUserKeyEmail(key, email){
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`
    ].join('&'));
    return this.request.post(this.AUTH_ENDPOINT+'verify_reset_password', urlSearchParams);
  }
  resetUserPassword(key, email, password, verify_password) {
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`,
      `password=${password}`,
      `verify_password=${verify_password}`
    ].join('&'));
    return this.request.post(this.AUTH_ENDPOINT+'reset_password', urlSearchParams);
  }
  magicLinkLogin(auth_token){
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('auth_token', auth_token);
    return this.request.post('api/auths.json?', urlSearchParams);
  }
  getUser() {
    return this.request.get('api/users.json');
  }
  isAuthenticated() {
    return true;
  }
}
