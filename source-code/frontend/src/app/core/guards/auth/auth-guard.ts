import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { Auth } from '#core/services/auth/auth';

/**
 * Prevents unauthenticated users from accessing protected routes (e.g. Profile, Settings, My Sightings).
 * Redirects to /log-in if the user is not authenticated.
 */
export const authGuard: CanMatchFn = (route, segments) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    // User is not logged in
    return router.createUrlTree(['/log-in']);
  }

  // Authenticated
  return true;
};