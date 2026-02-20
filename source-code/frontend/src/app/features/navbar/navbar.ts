import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLinkBase } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLinkBase],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

}
