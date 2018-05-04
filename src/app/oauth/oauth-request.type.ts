import { OAuthOptions } from './oauth-options.type';
import { ProviderConfiguration } from './provider-configuration.type';

/**
 * @description
 *
 * An OAuth2 - request. This is a container of ProviderMetadata and OAuthOptions
 * with a method to turn this to an URL.
 *
 */
export class OAuthRequest
{
    constructor(
        private readonly provider: ProviderConfiguration
      , private readonly options: OAuthOptions
    ) {}

    /**
     * Returns the provider.
     */
    public getProvider(): ProviderConfiguration
    {
        return this.provider;
    }

    /**
     * Returns the options.
     */
    public getOptions(): OAuthOptions
    {
        return this.options;
    }

    /**
     * Generates OAuth2 request URL from provider and options.
     */
    public toUrl(): string
    {
        const options = this.options;
        const encode = encodeURIComponent;
        let url: string;

        url = this.provider.authorization_endpoint;
        url += '?response_type=' + encode(options.response_type);
        url += (options.client_id ? '&client_id=' + encode(options.client_id) : '');
        url += (options.redirect_uri ? '&redirect_uri=' + encode(options.redirect_uri) : '');
        url += (options.nonce ? '&nonce=' + encode(options.nonce) : '');
        url += (options.scope ? '&scope=' + encode(options.scope) : '');
        url += (options.state ? '&state=' + encode(options.state) : '');

        return url;
    }
}
