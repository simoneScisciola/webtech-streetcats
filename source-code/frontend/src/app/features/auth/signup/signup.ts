import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '#core/services/auth/auth';
import { SignupPayload } from '#types/auth';
import { SignupForm } from './signup-form/signup-form';

@Component({
  selector: 'app-signup',
  imports: [SignupForm],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  /**
   * Sends sign up request
   * @param payload submitted data
   */
  onSignupSubmit(payload: SignupPayload) {
    this.auth.signup(payload).subscribe({
      next: (res) => {
        console.log("Response:", res);

        // Update Auth state
        this.auth.updateAuthResponse(res);

        // Redirect
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Sign Up failed.', err),
    });
  }

}
