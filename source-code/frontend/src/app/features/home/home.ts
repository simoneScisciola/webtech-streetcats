import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMapLocationDot, faUserPlus, faPaw } from '@fortawesome/free-solid-svg-icons';

import { Auth } from '#core/services/auth/auth';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  readonly authService = inject(Auth);

  // Icons
  readonly icons = {
    map: faMapLocationDot,
    join: faUserPlus,
    sightings: faPaw
  };

}