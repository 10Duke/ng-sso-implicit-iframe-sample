/**
 * @description
 *
 * A parsed OAuth2-response.
 *
 * Please note that `id_token` is the string representation of the ID-token, not the parsed representation.
 *
 */
export interface OAuthResponse
{
    access_token?: string;
    expires_in?: number;
    id_token?: string;
    state?: string;
    token_type?: string;
}
