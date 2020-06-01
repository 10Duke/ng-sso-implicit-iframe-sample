import { Inject, Optional } from '@angular/core';

import { Random } from '../random/random.type';

import { NonceGenerator } from './nonce-generator.type';
import { OAuthOptions } from './oauth-options.type';
import { OAuthRequest } from './oauth-request.type';
import { OAuthResponse } from './oauth-response.type';
import { ProviderConfiguration } from './provider-configuration.type';

/**
 * @description
 *
 * A service to manage OAuth2 requests and responses.
 *
 * OAuthService can be configured with default `ProviderMetadata` and `OAuthOptions`.
 * These defaults can be overridden in the `buildRequest()`-method on per-call basis.
 *
 * Note that this service does not initiate any requests.
 *
 */
export class OAuthService
{

    /**
     * Constructs new instance.
     *
     */
    constructor(
        private readonly nonce: NonceGenerator
      , private readonly defaultProvider?: ProviderConfiguration
      , private readonly defaultOptions?: OAuthOptions
    ) {}


    /**
     * Builds the request.
     *
     * The resulting `OAuthRequest` object can be used to generate URL to initiate the OAuth-flow.
     *
     */
    public buildRequest(
        overrideOptions?: OAuthOptions
      , overrideProvider?: ProviderConfiguration
    ): OAuthRequest
    {

        const options = Object.assign({}, this.defaultOptions, overrideOptions);

        if (! options.nonce) {
            options.nonce = this.nonce.generate();
        }

        return new OAuthRequest(
            Object.assign({}, this.defaultProvider, overrideProvider)
          , options
        );
    }


    /**
     *  Parses the OAuth-response.
     *
     *  Takes the `fragment` as parameter (the frament must start with `#`).
     *  The method takes optionally the original `OAuthRequest`. The request is
     *  not currently used, but in future there might be support of validating e.g.
     *  the nonce.
     *
     *  Returns the parsed `OAuthResponse`.
     */
    public parseResponse(fragment: string, request?: OAuthRequest): OAuthResponse
    {

        if (! fragment) {
            return null;
        }
        if (fragment.charAt(0) !== '#') {
            return null;
        }

        const response: OAuthResponse = {};
        const pairs = fragment.substr(1).split('&');
        const decode = decodeURIComponent;

        for (const pair of pairs) {
            const parameter = pair.split('=');
            const name = decode(parameter[0]);
            const value = decode(parameter[1]);

            switch (name) {
                case 'access_token':
                    response.access_token = value;
                    break;
                case 'expires_in':
                    response.expires_in = Number(value);
                    break;
                case 'id_token':
                    response.id_token = value;
                    break;
                case 'state':
                    response.state = value;
                    break;
                case 'token_type':
                    response.token_type = value;
                    break;
            }
        }

        return response;
    }
}
