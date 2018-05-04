import { Component, } from '@angular/core';

import { OAuthRequest } from '../oauth/oauth-request.type';
import { OAuthService } from '../oauth/oauth.service';

/**
 * Simple component to orchestrate the OAuth-implicit-flow-in-iframe + userinfo
 * demo.
 */
@Component({
    selector: 'xd-sso-demo'
  , template: `
<button *ngIf="!loginVisible" (click)="showLogin()">Login</button>
<xd-oauth-iframe
  *ngIf="loginVisible"
  classes="sso"
  [requestUrl]="requestUrl"
  (success)="onLoginSuccess($event)"
></xd-oauth-iframe>
<div *ngIf="token">
  <h1>Login successful</h1>
  <xd-userinfo *ngIf="token" [token]="token"></xd-userinfo>
</div>
`
})
export class SSODemoComponent
{
    public requestUrl: string;
    public loginVisible = false;
    private request: OAuthRequest = null;
    public userInfo: any;
    public error: any;
    public token: string;

    constructor(private readonly oauth: OAuthService) {}

    public onLoginSuccess(fragment: string): void
    {
      const response = this.oauth.parseResponse(fragment, this.request);

      this.loginVisible = false;
      this.token = response.access_token;
    }

    public showLogin(): void
    {
      this.loginVisible = true;

      // Generate new OAuth-request
      this.request = this.oauth.buildRequest();

      // Build the OAuth-request URL:
      this.requestUrl = this.request.toUrl();

      // Clear the token
      this.token = null;
    }


}
