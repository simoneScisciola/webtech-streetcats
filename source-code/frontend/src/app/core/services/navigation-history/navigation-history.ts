import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/** Auth-related paths that must never be stored as a return destination. */
const AUTH_PATHS = ['/log-in', '/sign-up'];

/**
 * Tracks the last non-auth URL visited, so components can redirect the user back to where they came from after login or sign-up.
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationHistory {

  private lastNonAuthUrl = '/home';

  constructor() {
    const router = inject(Router);

    // Listen to every completed navigation and store non-auth URLs
    router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        // Skip auth pages
        if (!AUTH_PATHS.some(p => e.urlAfterRedirects.startsWith(p))) {
          this.lastNonAuthUrl = e.urlAfterRedirects;
        }
      });
  }

  /** Returns the last visited URL that is not an auth page. */
  getReturnUrl(): string {
    return this.lastNonAuthUrl;
  }

}