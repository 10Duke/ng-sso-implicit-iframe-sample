import { NonceGenerator } from './nonce-generator.type';
import { OAuthService } from './oauth.service';
import { OAuthOptions } from './oauth-options.type';
import { ProviderConfiguration } from './provider-configuration.type';

class FakeNonceGenerator implements NonceGenerator
{
    public generate(): string {
        return 'non-sense';
    }
}

describe('OAuthService', () =>
{
    const NONCE = new FakeNonceGenerator();

    describe('#buildRequest', () =>
    {
        const DEFAULT_PROVIDER: ProviderConfiguration = {
            authorization_endpoint: 'https://id.example.com/authorize'
        };
        const DEFAULT_OPTIONS: OAuthOptions = {
            response_type:          'token'
        };

        it('should build request from default values', () =>
        {
            const request = new OAuthService(NONCE, DEFAULT_PROVIDER, DEFAULT_OPTIONS).buildRequest();
            const options = request.getOptions();

            expect(request.getProvider().authorization_endpoint).toBe('https://id.example.com/authorize');
            expect(options.response_type).toBe('token');
            expect(options.client_id).toBeUndefined();
            expect(options.nonce).toBe('non-sense');
        });

        it('should build request from provided values', () =>
        {
            const request = new OAuthService(NONCE).buildRequest(DEFAULT_OPTIONS, DEFAULT_PROVIDER);
            const options = request.getOptions();

            expect(request.getProvider().authorization_endpoint).toBe('https://id.example.com/authorize');
            expect(options.response_type).toBe('token');
            expect(options.client_id).toBeUndefined();
            expect(options.nonce).toBe('non-sense');
        });

        it('should build request overriding default options with provided options', () =>
        {
            const request = new OAuthService(NONCE, null, DEFAULT_OPTIONS).buildRequest({response_type: 'id_token', client_id: 'a-client'});
            const options = request.getOptions();

            expect(options.response_type).toBe('id_token');
            expect(options.client_id).toBe('a-client');
            expect(options.nonce).toBe('non-sense');
        });

        it('should build request overriding default provider with provided provider', () =>
        {
            const request = new OAuthService(NONCE, DEFAULT_PROVIDER, null).buildRequest(
                null,
                {authorization_endpoint: 'https://another.example.com/oauth2', userinfo_endpoint: 'https://another.example.com/userinfo'}
            );
            const options = request.getOptions();

            expect(request.getProvider().authorization_endpoint).toBe('https://another.example.com/oauth2');
            expect(request.getProvider().userinfo_endpoint).toBe('https://another.example.com/userinfo');
        });

        it('should return empty object with only nonce if no options given', () =>
        {
            const request = new OAuthService(NONCE).buildRequest();
            const options = request.getOptions();

            expect(request.getProvider()).toBeDefined(); // Provider should be empty object
            expect(options.response_type).toBeUndefined();
            expect(options.client_id).toBeUndefined();
            expect(options.nonce).toBe('non-sense');
        });

        it('should use provided nonce', () =>
        {
            const request = new OAuthService(NONCE).buildRequest({nonce: 'nonsense'});
            const options = request.getOptions();

            expect(options.response_type).toBeUndefined();
            expect(options.client_id).toBeUndefined();
            expect(options.nonce).toBe('nonsense');
        });
    });

    describe('#parseResponse', () =>
    {
        let service: OAuthService;

        beforeEach(() =>
        {
            service = new OAuthService(NONCE);
        });

        it('should parse access_token', () =>
        {
            expect(service.parseResponse('#access_token=abc%20def').access_token).toBe('abc def');
        });
        it('should parse expires_in', () =>
        {
            expect(service.parseResponse('#expires_in=3600').expires_in).toBe(3600);
        });
        it('should parse id_token', () =>
        {
            expect(service.parseResponse('#id_token=aaa.bbb.ccc').id_token).toBe('aaa.bbb.ccc');
        });
        it('should parse state', () =>
        {
            expect(service.parseResponse('#state=%2Froot%2F').state).toBe('/root/');
        });
        it('should parse token_type', () =>
        {
            expect(service.parseResponse('#token_type=Bearer').token_type).toBe('Bearer');
        });
        it('should return null if no fragment', () =>
        {
            expect(service.parseResponse(null)).toBe(null);
        });
        it('should return null if fragment does not start with hash', () =>
        {
            expect(service.parseResponse('access_token=abc')).toBe(null);
        });
        it('should parse assorted parameters ', () =>
        {
            const response = service.parseResponse(''
              + '#access_token=abc%20def'
              + '&expires_in=3600'
              + '&id_token=aaa.bbb.ccc'
              + '&state=%2Froot%2F'
              + '&token_type=Bearer'
            );

            expect(response.access_token).toBe('abc def');
            expect(response.expires_in).toBe(3600);
            expect(response.id_token).toBe('aaa.bbb.ccc');
            expect(response.state).toBe('/root/');
            expect(response.token_type).toBe('Bearer');
        });
    });

});
