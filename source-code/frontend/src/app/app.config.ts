import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { Config } from '#core/services/config/config';
import { authInterceptor } from '#core/interceptors/auth-interceptor/auth-interceptor';
import { sessionExpiredInterceptor } from '#core/interceptors/session-expired-interceptor/session-expired-interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(), // Use the Fetch API instead of XMLHttpRequests
      withInterceptors([authInterceptor, sessionExpiredInterceptor])
    ),
    provideAppInitializer(() => {
      const config = inject(Config);
      return config.load();
    })
  ]
};
