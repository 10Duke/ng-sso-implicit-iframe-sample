import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SSODemoModule } from './sso-demo/sso-demo.module';

import { AppComponent } from './app.component';

import { WINDOW } from './window/window.service';
import { IFrameResizer } from './iframeresizer/IFrameResizer';
import { DefaultNonceGenerator } from './oauth/default-nonce-generator.type';
import { OAuthService } from './oauth/oauth.service';
import { DEFAULT_OAUTH_PROVIDER } from './oauth/oauth-provider.token';
import { ProviderConfiguration } from './oauth/provider-configuration.type';


// Configure OAuth2 provider metadata
const defaultProvider: ProviderConfiguration = {
    authorization_endpoint:     'https://id.10duke.com/embed/oauth2/authz'
  , userinfo_endpoint:          'https://id.10duke.com/userinfo'
};

// Configure the OAuthService with default authentication request parameters.
// Uses the unsafe Math.random for this demo.
//
// Note that the redirect URI in this case points to local file served by the
// development http-server as started by `ng serve`. If you are serving the
// demo-app any other way, change the redirect_uri appropriately.
const oauthService: OAuthService = new OAuthService(
    new DefaultNonceGenerator(Math.random)
  , defaultProvider
  , {
        client_id:      'localoauth20'
      , response_type:  'id_token token'
      , redirect_uri:   'http://localhost:4200/login/implicit/callback.html'
      , scope:          'openid profile email'
    }
);


@NgModule({
    declarations: [
        AppComponent
    ]
  , imports: [
        BrowserModule
      , SSODemoModule
    ]
  , providers: [
        IFrameResizer
      , {provide: DEFAULT_OAUTH_PROVIDER, useValue: defaultProvider}
      , {provide: OAuthService, useValue: oauthService}
      , {provide: WINDOW, useValue: window}
    ]
  , bootstrap: [AppComponent]
})
export class AppModule { }
