import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { getUserLanguage, TRANSLATE_OPTIONS } from '@alauda-fe/common';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(),
    {
      provide: TRANSLATE_OPTIONS,
      useFactory: () => ({
        locales: ['en', 'zh'],
        locale: getUserLanguage(['en', 'zh']),
        loose: true,
      }),
    },
  ],
};
