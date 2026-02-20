import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '#core/services/auth/auth';
import { LoginPayload } from '#types/auth';
import { LoginForm } from './login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  /**
   * Sends login request
   * @param payload submitted credetials
   */
  onLogin(payload: LoginPayload) {
    this.auth.login(payload).subscribe({
      next: (res) => {
        console.log("Response:", res);

        // Update Auth state
        this.auth.updateAuthResponse(res);

        // Redirect
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Login failed.', err),
    });
  }

}