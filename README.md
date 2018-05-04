# OAuth2 implicit flow in iframe Single-Sign-On demo

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
