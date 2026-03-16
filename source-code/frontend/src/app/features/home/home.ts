import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMapLocationDot, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  // Icons
  readonly icons = {
    map: faMapLocationDot,
    join: faUserPlus
  };

}