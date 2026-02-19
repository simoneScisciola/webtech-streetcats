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

  onSignup(payload: SignupPayload): void {
    this.auth.signup(payload).subscribe({
      next: (res) => {
        console.log("Response:", res);
        this.router.navigate(['/map']);
      },
      error: (err) => console.error('Sign Up fallito', err),
    });
  }
}
