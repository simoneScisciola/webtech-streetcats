import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '#core/services/auth/auth';
import { ObservableToast } from '#core/services/observable-toast/observable-toast';
import { NavigationHistory } from '#core/services/navigation-history/navigation-history';
import { SignupPayload } from '#shared/types/auth';
import { SignupForm } from './signup-form/signup-form';

@Component({
  selector: 'app-signup',
  imports: [SignupForm],
  providers: [ObservableToast],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {

  private readonly router = inject(Router);
  private readonly authService = inject(Auth);
  private readonly navigationHistory = inject(NavigationHistory);
  protected readonly observableToastService = inject(ObservableToast);

  /**
   * Sends sign up request.
   * @param payload submitted data
   */
  onSignupSubmit(payload: SignupPayload) {
    this.observableToastService.trigger(
      this.authService.signup(payload),
      {
        loading: "Signing up...",
        success: "Signed up successfully.",
        error: "Sign up failed. Please, try again.",
        onSuccess: (res) => {
          console.log("Response:", res);

          // Redirect back to the last non-auth page visited (or /home as fallback)
          this.router.navigateByUrl(this.navigationHistory.getReturnUrl());
        },
        onError: (err) => console.error('Sign up failed.', err),
        onRetry: () => this.authService.signup(payload)
      }
    )
  }

}
