# OAuth2 implicit flow in iframe Single-Sign-On demo

**IMPORTANT:** ***Deprecated***. OAuth2 implicit grant flow should NOT be used due to security
vulnerabilities (see ["OAuth 2.0 Security Best Current Practice"](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics#name-implicit-grant)).
Use OAuth2 authorization code with PKCE instead. For a sample for Angular with source code, see
[OAuth2 authorization code flow with PKCE Single-Sign-On demo](https://github.com/10Duke/ng-sso-authzcode-pkce-sample).
This repository is preserved only for reference.

## Contents
This demo application demonstrates how to perform OAuth2 implicit flow SSO in an
iframe, and then request `/userinfo` with the access token.

## Running the demo

1. Clone the repo.
2. Install ng-cli: `npm install -g @angular/cli`
3. Build: `npm install`
4. Run: `npm start`
5. Navigate to `http://localhost:4200/`


## Configuration

The application is configured in `app.module.ts`: You need to modify the
configuration e.g. if you are running against different IdP.


## Notes

The application is not strictly "single-page", as this particular example uses a
static HTML-file as OAuth callback target. The OAuth-dialog happens in the iframe
and success is signaled using `window.parent.postMessage()` in the callback HTML.

The demo is tested with Chrome and Firefox. Older browsers (e.g. IE 9-11) need at
least polyfills enabled.
