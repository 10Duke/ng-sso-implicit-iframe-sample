import { InjectionToken } from '@angular/core';
import { ProviderConfiguration } from './provider-configuration.type';

export const DEFAULT_OAUTH_PROVIDER = new InjectionToken<ProviderConfiguration>('default OAuth2 provider configuration');
