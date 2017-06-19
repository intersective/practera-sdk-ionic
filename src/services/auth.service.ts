import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
import { URLSearchParams } from '@angular/http';
@Injectable()
export class AuthService {
  httpHeaderStrObj = { 'Content-Type': 'application/x-www-form-urlencoded'};

  constructor(private request: RequestService) {}

  getTerms() {
    return this.request.get('api/registration_details.json');
  }

  /**
   * verify url's parameters has the valid email and key (registration code)
   * @param {object} data object with key and email in it
   */
  verifyRegistration(data) {
    return this.request.post('api/auths.json?action=verify_registration', {
      'email': data.email,
      'key': data.key
    });
  }

  register(data) {
    let urlSearchParams = new URLSearchParams([
      `password=${data.password}`,
      `user_id=${data.user_id}`,
      `key=${data.key || 'thisissamplekey'}`
    ].join('&'));

    return this.request.post('api/auth.json?action=registration', data);
  }

  loginAuth(email, password) {
    let urlSearchParams = new URLSearchParams([
      `data[User][email]=${email}`,
      `data[User][password]=${password}`
    ].join('&'));

    return this.request.post(
             'api/auths.json?action=authentication',
             urlSearchParams.toString(),
             this.httpHeaderStrObj);
  }

  forgotPassword(email){
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('email', email);
    return this.request.post(
             'api/auths.json?action=forgot_password',
             urlSearchParams.toString(),
             this.httpHeaderStrObj);
  }

  verifyUserKeyEmail(key, email){
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`
    ].join('&'));
    return this.request.post(
             'api/auths.json?action=verify_reset_password',
             urlSearchParams.toString(),
             this.httpHeaderStrObj);
  }
  resetUserPassword(key, email, password, verify_password) {
    let urlSearchParams = new URLSearchParams([
      `key=${key}`,
      `email=${email}`,
      `password=${password}`,
      `verify_password=${verify_password}`
    ].join('&'));
    return this.request.post(
             'api/auths.json?action=reset_password',
             urlSearchParams.toString(),
             this.httpHeaderStrObj);
  }
  magicLinkLogin(auth_token){
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('auth_token', auth_token);
    return this.request.post(
             'api/auths.json?',
             urlSearchParams.toString(),
             this.httpHeaderStrObj);
  }
  isAuthenticated() {
    return true;
  }
  getUser() {
    return this.request.get('api/users.json');
  }
}
