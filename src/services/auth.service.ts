import { Injectable } from '@angular/core';
import { RequestService } from '../shared/request/request.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

const AUTH_ENDPOINT = 'api/auths.json?action=';

@Injectable()
export class AuthService {
  appkey: any = this.request.getAppkey();
  prefixUrl: any = this.request.getPrefixUrl();

  constructor(
    public request: RequestService,
  ) {}

  getTerms() {
    return this.request.get(this.prefixUrl + 'api/registration_details.json');
  }
  private postRequest(type, params) {
    return this.request.post(AUTH_ENDPOINT + type, {params});
  }

  verifyRegistration(data) {
    let params = new HttpParams();
    params.set('email', data.email);
    params.set('key', data.key);

    return this.postRequest('verify_registration', params);
  }

  register(data) {
    let params = new HttpParams();
    params.set('password', data.password);
    params.set('user_id', data.user_id);
    params.set('key', data.key);

    return this.postRequest('registration', params);
  }

  loginAuth(email, password) {
    let params = new HttpParams();
    params.set('data[User][email]', email);
    params.set('data[User][password]', password);

    return this.postRequest('authentication', params);
  }

  forgotPassword(email) {
    let params = new HttpParams();
    params.set('email', email);

    return this.postRequest('forgot_password', params);
  }

  verifyUserKeyEmail(key, email) {
    let params = new HttpParams();
    params.set('key', key);
    params.set('email', email);

    return this.postRequest('verify_reset_password', params);
  }

  resetUserPassword(key, email, password, verify_password) {
    let params = new HttpParams();
    params.set('key', key);
    params.set('email', email);
    params.set('password', password);
    params.set('verify_password', verify_password);

    return this.postRequest('reset_password', params);
  }

  magicLinkLogin(auth_token) {
    let params = new HttpParams();
    params.set('auth_token', auth_token);
    return this.request.post(this.prefixUrl+'api/auths.json?', {params});
  }

  getUser() {
    return this.request.get('api/users.json');
  }

  isAuthenticated() {
    return true;
  }
}
