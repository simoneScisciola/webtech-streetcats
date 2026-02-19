import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Auth } from '#core/services/auth/auth';
import { Navbar } from '#features/navbar/navbar';

@Component({
  selector: 'app-header',
  imports: [Navbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  readonly auth = inject(Auth);
  private readonly router = inject(Router);

  login() {
    this.router.navigate(["/log-in"]);
  }

  signup() {
    this.router.navigate(["/sign-up"]);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(["/home"]);
  }

}
