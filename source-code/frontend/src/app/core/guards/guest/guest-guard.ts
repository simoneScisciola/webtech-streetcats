import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { Auth } from '#core/services/auth/auth';

/**
 * Prevents authenticated users from accessing guest-only routes (e.g. Login, Signup).
 * Redirects to /home if the user is already authenticated.
 */
export const guestGuard: CanMatchFn = (route, segments) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // User is logged in
    return router.createUrlTree(['/home']);
  }

  // Not authenticated
  return true;
};