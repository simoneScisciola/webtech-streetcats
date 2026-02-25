import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';

import { Auth } from '#core/services/auth/auth';

export const sessionExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {

      // Handle expired or invalid session
      if (error instanceof HttpErrorResponse && error.status === 401) {
        auth.logout();
        toast.error('Session expired. Please log in again.');
        router.navigate(['/log-in']);
      }

      // Re-throw the error
      return throwError(() => error);
    })
  );
};