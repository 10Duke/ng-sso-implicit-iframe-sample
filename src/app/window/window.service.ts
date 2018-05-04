import { InjectionToken } from '@angular/core';

/**
 * @description
 *
 * Typed injection token for javascript `window`-object.
 */
export const WINDOW = new InjectionToken<Window>('browser window');
