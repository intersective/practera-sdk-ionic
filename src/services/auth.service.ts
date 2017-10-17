import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
@Injectable()
export class AuthService {
  public appkey: any = this.request.getAppkey();
  public prefixUrl: any = this.request.getPrefixUrl();
  public AUTH_ENDPOINT: any = this.prefixUrl + 'api/auths.json?action=';
  public headerData() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('appkey', this.appkey);
    return headers;
  }
  constructor(public request: RequestService,
              public http: Http) {}
  getTerms() {
    let options = new RequestOptions({headers: this.headerData()});
    return this.http.get(this.prefixUrl+'api/registration_details.json', options)
                    .map(res => res.json());
  }
  verifyRegistration(data) {
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams([
      `email=${data.email}`,
      `key=${data.key}`
    ].join('&'));
    return this.http.post(this.AUTH_ENDPOINT+'verify_registration', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }
  register(data) {
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams([
      `password=${data.password}`,
      `user_id=${data.user_id}`,
      `key=${data.key || 'thisissamplekey'}`
    ].join('&'));
    return this.http.post(this.AUTH_ENDPOINT+'registration', urlSearchParams.toString(), options)
    .map(res => res.json());
  }
  loginAuth(email, password) {
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams([
      `data[User][email]=${email}`,
      `data[User][password]=${password}`
    ].join('&'));
    return this.http.post(this.AUTH_ENDPOINT+'authentication', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }
  forgotPassword(email){
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('email', email);
    return this.http.post(this.AUTH_ENDPOINT+'forgot_password', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }
  verifyUserKeyEmail(key, email){
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`
    ].join('&'));
    return this.http.post(this.AUTH_ENDPOINT+'verify_reset_password', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }
  resetUserPassword(key, email, password, verify_password) {
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`,
      `password=${password}`,
      `verify_password=${verify_password}`
    ].join('&'));
    return this.http.post(this.AUTH_ENDPOINT+'reset_password', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }
  magicLinkLogin(auth_token){
    let options = new RequestOptions({headers: this.headerData()});
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('auth_token', auth_token);
    return this.http.post(this.prefixUrl+'api/auths.json?', urlSearchParams.toString(), options)
                    .map(res => res.json());
  }
  getUser() {
    return this.request.get('api/users.json');
  }
  isAuthenticated() {
    return true;
  }
}