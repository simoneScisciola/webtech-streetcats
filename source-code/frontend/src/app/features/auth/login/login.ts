import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '#core/services/auth/auth';
import { ObservableToast } from '#core/services/observable-toast/observable-toast';
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

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  protected readonly observableToast = inject(ObservableToast);

  /**
   * Sends login request
   * @param payload submitted credetials
   */
  onLoginSubmit(payload: LoginPayload) {
    this.observableToast.trigger(
      this.auth.login(payload),
      {
        loading: "Logging in...",
        success: "Logged successfully.",
        error: "Login failed. Please, try again.",
        onSuccess: (res) => {
          console.log("Response:", res);

          // Redirect
          this.router.navigate(['/home']);
        },
        onError: (err) => console.error('Login failed.', err),
        onRetry: () => this.auth.login(payload)
      }
    )
  }

}