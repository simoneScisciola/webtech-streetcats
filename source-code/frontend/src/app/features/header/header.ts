import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Auth } from '#core/services/auth/auth';
import { Navbar } from '#features/navbar/navbar';
import { ProfileDropdown } from './profile-dropdown/profile-dropdown';
import { AuthArea } from './auth-area/auth-area';

@Component({
  selector: 'app-header',
  imports: [Navbar, RouterLink, ProfileDropdown, AuthArea],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  readonly auth = inject(Auth);

}
