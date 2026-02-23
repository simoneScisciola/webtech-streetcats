import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '#core/services/auth/auth';
import { ObservableToast } from '#core/services/observable-toast/observable-toast';
import { SignupPayload } from '#types/auth';
import { SignupForm } from './signup-form/signup-form';

@Component({
  selector: 'app-signup',
  imports: [SignupForm],
  providers: [ObservableToast],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly toast = inject(ObservableToast);

  /**
   * Sends sign up request
   * @param payload submitted data
   */
  onSignupSubmit(payload: SignupPayload) {
    this.toast.trigger(
      this.auth.signup(payload),
      {
        loading: "Signing up...",
        success: "Signed up successfully.",
        error: "Sign up failed. Please, try again.",
        onSuccess: (res) => {
          console.log("Response:", res);

          // Redirect
          this.router.navigate(['/home']);
        },
        onError: (err) => console.error('Sign up failed.', err),
        onRetry: () => this.auth.signup(payload)
      }
    )
  }

}
