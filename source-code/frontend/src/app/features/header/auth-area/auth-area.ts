import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-area',
  imports: [],
  templateUrl: './auth-area.html',
  styleUrl: './auth-area.scss',
})
export class AuthArea {

  private readonly router = inject(Router);

  onLogin() {
    this.router.navigate(["/log-in"]);
  }

  onSignup() {
    this.router.navigate(["/sign-up"]);
  }

}
