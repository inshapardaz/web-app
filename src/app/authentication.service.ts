import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthConfig, OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';

import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {
  public userProfile: any;
  constructor(private http: Http, public router: Router, private oauthService: OAuthService) {
  }

  public configureOAuth() {
    let authority: string;
    const sessionOverride: string = sessionStorage.getItem('auth-server-address');
    if (sessionOverride !== null) {
      authority = sessionOverride;
    } else {
      authority = 'http://ipid.azurewebsites.net';
    }

    const authConfig = new AuthConfig();
    authConfig.issuer = authority;
    authConfig.redirectUri = window.location.origin;
    authConfig.silentRefreshRedirectUri = window.location.origin + '/silent-renew.html';
    authConfig.clientId = 'angular2client';
    authConfig.scope = 'openid';
    authConfig.sessionChecksEnabled = true;
    authConfig.requireHttps = false;

    this.oauthService.configure(authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  public login() {
    this.oauthService.initImplicitFlow();
  }

  public logout(): boolean {
    this.oauthService.logOut();

    this.router.navigate(['/home']);
    return true;
  }

  public isAuthenticated(): boolean {
    return this.oauthService.getAccessToken() != null;
  }

  public refreshToken() {
    this.oauthService.silentRefresh();
  }

  public loadUserProfile(): void {
    this
        .oauthService
        .loadUserProfile()
        .then(up => {
          console.log(up);
          this.userProfile = up;
        });

  }

  AuthGet(url: string, options?: RequestOptions): Observable<Response> {

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.get(url, options);
  }

  AuthPut(url: string, data: any, options?: RequestOptions): Observable<Response> {

    const body = JSON.stringify(data);

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.put(url, body, options);
  }

  AuthDelete(url: string, options?: RequestOptions): Observable<Response> {

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.delete(url, options);
  }

  AuthPost(url: string, data: any, options?: RequestOptions): Observable<Response> {

    const body = JSON.stringify(data);

    if (options) {
      options = this._setRequestOptions(options);
    } else {
      options = this._setRequestOptions();
    }
    return this.http.post(url, body, options);
  }


  private _setAuthHeaders(): Headers {
    const authHeaders = new Headers();
    authHeaders.append('Authorization', 'Bearer ' + this.oauthService.getIdToken());
    if (authHeaders.get('Content-Type')) {

    } else {
      authHeaders.append('Content-Type', 'application/json');
    }
    return  authHeaders;
  }
  private _setRequestOptions(options?: RequestOptions) {
    let authHeaders: Headers;
    if (this.isAuthenticated()) {
      authHeaders = this._setAuthHeaders();
    }
    if (options) {
      options.headers.append(authHeaders.keys[0], authHeaders.values[0]);
    } else {
      options = new RequestOptions({ headers: authHeaders });
    }

    return options;
  }
}
