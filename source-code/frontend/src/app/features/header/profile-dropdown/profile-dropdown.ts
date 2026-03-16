import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'ngx-sonner';

import { Auth } from '#core/services/auth/auth';

@Component({
  selector: 'app-profile-dropdown',
  imports: [NgbDropdownModule, NgbTooltipModule, FontAwesomeModule],
  templateUrl: './profile-dropdown.html',
  styleUrl: './profile-dropdown.scss',
})
export class ProfileDropdown {

  private readonly router = inject(Router);
  readonly authService = inject(Auth);

  // Font Awesome icons
  icons = {
    logout: faRightFromBracket
  };

  /** Logs the user out and redirects to the home page. */
  onLogout() {
    this.authService.logout();
    this.router.navigate(["/home"]);
    toast.success('Logged out successfully.');
  }

}