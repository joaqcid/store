import { InjectionToken } from '@angular/core';

import { ActionType } from '../actions/symbols';

export interface NgxsDevelopmentOptions {
  // This allows setting only `true` because there's no reason to set `false`.
  // Developers may just skip importing the development module at all.
  warnOnUnhandledActions:
    | true
    | {
        ignore: ActionType[];
      };
}

export const NGXS_DEVELOPMENT_OPTIONS =
  /* @__PURE__ */ new InjectionToken<NgxsDevelopmentOptions>(
    typeof ngDevMode !== 'undefined' && ngDevMode ? 'NGXS_DEVELOPMENT_OPTIONS' : '',
    {
      providedIn: 'root',
      factory: () => ({ warnOnUnhandledActions: true })
    }
  );