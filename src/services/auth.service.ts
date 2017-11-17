import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
// Others
import { RequestService } from '../shared/request/request.service';
const AUTH_ENDPOINT = 'api/auths.json?action=';
@Injectable()
export class AuthService {
  appkey: any = this.request.getAppkey();
  prefixUrl: any = this.request.getPrefixUrl();
  constructor(
    public request: RequestService,
  ) {}
  private postRequest(type, body) {
    return this.request.post(AUTH_ENDPOINT + type, body);
  }
  verifyRegistration(data) {
    let email = data.email;
    let key = data.key; 
    if(!data.email || !data.key){
      return undefined;
    }
    return this.postRequest('verify_registration', { email, key });
  }
  register(data) {
    if(!data.password || !data.user_id || !data.key){
      return undefined;
    }
    return this.postRequest('registration', {
      password: data.password,
      user_id: data.user_id,
      key: data.key,
    });
  }
  loginAuth(email, password) {
    if(!email || !password){
      return undefined;
    }
    return this.postRequest('authentication', `data[User][email]=${email}&data[User][password]=${password}`);
  }
  forgotPassword(email) {
    if(!email){
      return undefined;
    }
    return this.postRequest('forgot_password', { email });
  }
  verifyUserKeyEmail(key, email) {
    if(!key || !email){
      return undefined;
    }
    return this.postRequest('verify_reset_password', { key, email });
  }
  resetUserPassword(key, email, password, verify_password) {
    if(!key || !email || !password || !verify_password){
      return undefined;
    }
    return this.postRequest('reset_password', { key, email, password, verify_password });
  }
  magicLinkLogin(auth_token) {
    if(!auth_token){
      return undefined;
    }
    return this.request.post('api/auths.json', { auth_token });
  }
  getUser() {
    return this.request.get('api/users.json');
  }
  isAuthenticated() {
    return true;
  }
}
