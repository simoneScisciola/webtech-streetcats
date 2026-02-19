import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightToBracket, faUser, faLock } from '@fortawesome/free-solid-svg-icons';

import { FormCard } from '#shared/components/form-card/form-card';
import { FormCardHeader } from '#shared/components/form-card/form-card-header/form-card-header';
import { FormCardBody } from '#shared/components/form-card/form-card-body/form-card-body';
import { FormCardFooter } from '#shared/components/form-card/form-card-footer/form-card-footer';
import { FormCardField } from '#shared/components/form-card/form-card-field/form-card-field';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, FormCard, FormCardHeader, FormCardBody, FormCardField, FormCardFooter, FontAwesomeModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {

  @Output() formSubmitted = new EventEmitter<{ username: string; password: string }>();

  // Field labels
  icons = {
    login: faRightToBracket,
    user: faUser,
    lock: faLock
  };

  // Form
  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required]),
    password: new FormControl('', [
      Validators.required]),
  });

  // Error messages
  usernameErrors = {
    required:  'Username required.'
  };
  passwordErrors = {
    required: 'Password required.'
  };
  
  // Getters
  get username() {
    return this.loginForm.controls.username;
  }
  get password() {
    return this.loginForm.controls.password;
  }

  /**
   * Manages form submit
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      // Send fields to upper component
      const { username, password } = this.loginForm.getRawValue();
      this.formSubmitted.emit({ username: username!, password: password! });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}