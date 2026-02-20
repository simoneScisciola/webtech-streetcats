import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { Auth } from '#core/services/auth/auth';

@Component({
  selector: 'app-profile-dropdown',
  imports: [NgbDropdownModule, FontAwesomeModule],
  templateUrl: './profile-dropdown.html',
  styleUrl: './profile-dropdown.scss',
})
export class ProfileDropdown {

  readonly auth = inject(Auth);
  private readonly router = inject(Router);

  // Font Awesome icons
  icons = {
    logout: faRightFromBracket
  };

  onLogout() {
    this.auth.logout();
    this.router.navigate(["/home"]);
  }

}