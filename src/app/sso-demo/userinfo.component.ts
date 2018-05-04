import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DEFAULT_OAUTH_PROVIDER } from '../oauth/oauth-provider.token';
import { ProviderConfiguration } from '../oauth/provider-configuration.type';

/**
 *  Simple userinfo-component.
 *  The component does HTTP-request to userinfo-endpoint, when the bound input `token` changes.
 */
@Component({
    selector: 'xd-userinfo'
  , template: `
<div *ngIf="userInfo">
    Given name: {{userInfo.given_name}}<br>
    Family name: {{userInfo.family_name}}<br>
    Email: {{userInfo.email}}<br>
</div>
`
})
export class UserInfoComponent implements OnChanges
{
    /** Access token used for authorization. */
    @Input() public token: string;

    public userInfo: any;
    public error: any;

    constructor(
        private readonly http: HttpClient,
        @Inject(DEFAULT_OAUTH_PROVIDER) private readonly oauthProvider: ProviderConfiguration
    ) {}

    public ngOnChanges(changes: SimpleChanges): void
    {
        this.token = changes.token.currentValue;

        if (this.token) {
            this.http.get<any>(
                this.oauthProvider.userinfo_endpoint
              , {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.token})}
            ).subscribe(
                data => {this.userInfo = data; }
              , error => {this.error = error; }
            );
        }
    }

}
