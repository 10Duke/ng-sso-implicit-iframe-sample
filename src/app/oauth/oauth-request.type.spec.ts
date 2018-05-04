import { OAuthOptions } from './oauth-options.type';
import { OAuthRequest } from './oauth-request.type';
import { ProviderConfiguration } from './provider-configuration.type';

describe('OAuthRequest', () =>
{
  const DEFAULT_PROVIDER: ProviderConfiguration = {
      authorization_endpoint: 'https://id.example.com/authorize'
  };
  const SIMPLE_OPTIONS: OAuthOptions = {
      response_type:              'id_token token'
  };

  it('#toUrl should return proper url with all values in place', () =>
  {
    const request = new OAuthRequest(
        DEFAULT_PROVIDER
      , {
            response_type:              'id_token token'
          , client_id:                  'abc 123'
          , redirect_uri:               'https://client.example.com/login/callback'
          , nonce:                      'qwe rty'
          , scope:                      'openid profile'
          , state:                      '/root/'
        }
    );

    expect(request.toUrl()).toBe(''
      + 'https://id.example.com/authorize'
      + '?response_type=id_token%20token'
      + '&client_id=abc%20123'
      + '&redirect_uri=https%3A%2F%2Fclient.example.com%2Flogin%2Fcallback'
      + '&nonce=qwe%20rty'
      + '&scope=openid%20profile'
      + '&state=%2Froot%2F'
    );
  });

  it('#toUrl should return proper url when some options are missing', () =>
  {
      expect(new OAuthRequest(DEFAULT_PROVIDER, SIMPLE_OPTIONS).toUrl()).toBe(''
      + 'https://id.example.com/authorize'
      + '?response_type=id_token%20token'
    );
  });

  it('#getOptions should return the options', () =>
  {
      expect(new OAuthRequest(DEFAULT_PROVIDER, SIMPLE_OPTIONS).getOptions()).toBe(SIMPLE_OPTIONS);
  });

  it('#getProvider should return the provider', () =>
  {
      expect(new OAuthRequest(DEFAULT_PROVIDER, SIMPLE_OPTIONS).getProvider()).toBe(DEFAULT_PROVIDER);
  });

});

