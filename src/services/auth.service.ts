import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
  _auth0 = new auth0.WebAuth({
    clientID: 'WkEHQXUHgcec5GhzLqUZ0PTVYJ4u9ihI',
    domain: 'inshapardaz.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://inshapardaz.eu.auth0.com/userinfo',
    redirectUri: 'http://localhost:5001/callback',      
    scope: 'openid'
  });

  userProfile: any;

  constructor(public router: Router) {
  }

  ngOnInit() {
    if (this.isAuthenticated()) {
      this.getProfile(() => console.log('profile loaded'));
    }
  }


  public login(): void {
    this._auth0.authorize({});
  }

  public handleAuthentication(): void {
    this._auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.getProfile(() => this.router.navigate(['/home']));
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): boolean {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    
    this.router.navigate(['/home']);
    return true;
  }

  public isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public getProfile(cb): void {
    var accessToken = localStorage.getItem('access_token');
    if (accessToken == null) {
      cb(null, {});
      return;
    }

    const self = this;
    this._auth0.client.userInfo(accessToken, (err, profile) => {
      console.log(profile);
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }
}