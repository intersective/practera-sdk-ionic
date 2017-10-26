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
    return this.request.get('api/registration_details.json');
  }
  private postRequest(type, body) {
    return this.request.post(AUTH_ENDPOINT + type, body);
  }

  verifyRegistration(data) {
    let params = new HttpParams();
    params.set('email', data.email);
    params.set('key', data.key);

    return this.postRequest('verify_registration', params);
  }

  register(data) {
    return this.postRequest('registration', {
      password: data.password,
      user_id: data.user_id,
      key: data.key,
    });
  }

  loginAuth(email, password) {
    return this.postRequest('authentication', `data[User][email]=${email}&data[User][password]=${password}`);
  }

  forgotPassword(email) {
    return this.postRequest('forgot_password', { email });
  }

  verifyUserKeyEmail(key, email) {
    return this.postRequest('verify_reset_password', {
      key: key,
      email: email,
    });
  }

  resetUserPassword(key, email, password, verify_password) {
    return this.postRequest('reset_password', { key, email, password, verify_password });
  }

  magicLinkLogin(auth_token) {
    return this.request.post('api/auths.json', { auth_token });
  }

  getUser() {
    return this.request.get('api/users.json');
  }

  isAuthenticated() {
    return true;
  }
}
