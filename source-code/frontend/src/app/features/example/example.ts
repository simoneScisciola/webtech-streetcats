import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faApplePay } from '@fortawesome/free-brands-svg-icons'

import { LoginForm } from '#features/auth/login/login-form/login-form';
import { SignupForm } from '#features/auth/signup/signup-form/signup-form';
import { SightingForm } from '#features/sighting-form/sighting-form';

@Component({
  selector: 'app-example',
  imports: [FontAwesomeModule, LoginForm, SignupForm, SightingForm],
  templateUrl: './example.html',
  styleUrl: './example.scss',
})
export class Example {
  faUser = faUser;
  faApplePay = faApplePay;

  onLogin(event: any) {
    console.log("LOGIN")
  }

  onSignup(event: any) {
    console.log("SIGNUP")
  }

  onAddSighting(event: any) {
    console.log("ADD SIGHTING")
  }
}
