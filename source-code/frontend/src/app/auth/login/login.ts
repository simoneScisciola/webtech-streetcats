import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth, LoginPayload } from '../../core/services/auth/auth';
import { LoginForm } from './login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth   = inject(Auth);
  private router = inject(Router);

  onLogin(payload: LoginPayload): void {
    this.auth.login(payload).subscribe({
      next:  (res) => this.router.navigate(['/map']),
      error: (err) => console.error('Login fallito', err),
    });
  }
}