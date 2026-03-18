import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '#core/services/auth/auth';
import { ObservableToast } from '#core/services/observable-toast/observable-toast';
import { NavigationHistory } from '#core/services/navigation-history/navigation-history';
import { LoginPayload } from '#shared/types/auth';
import { LoginForm } from './login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [LoginForm],
  providers: [ObservableToast],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly router = inject(Router);
  private readonly authService = inject(Auth);
  private readonly navigationHistory = inject(NavigationHistory);
  protected readonly observableToastService = inject(ObservableToast);

  /**
   * Sends login request.
   * @param payload submitted data
   */
  onLoginSubmit(payload: LoginPayload) {
    this.observableToastService.trigger(
      this.authService.login(payload),
      {
        loading: "Logging in...",
        success: "Logged successfully.",
        error: "Login failed. Please, try again.",
        onSuccess: (res) => {
          console.log("Response:", res);

          // Redirect back to the last non-auth page visited (or /home as fallback)
          this.router.navigateByUrl(this.navigationHistory.getReturnUrl());
        },
        onError: (err) => console.error('Login failed.', err),
        onRetry: () => this.authService.login(payload)
      }
    )
  }

}
