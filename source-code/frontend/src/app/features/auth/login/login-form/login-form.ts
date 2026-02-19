import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightToBracket, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

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

  @Output() formSubmitted = new EventEmitter<{ email: string; password: string }>();

  // Field labels
  icons = {
    login: faRightToBracket,
    email: faEnvelope,
    lock: faLock
  };

  // Form
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email]),
    password: new FormControl('', [
        Validators.required,
        hasUpperCase,
        hasNumber,
        hasSpecialChar]),
  });

  // Error messages
  emailErrors = { required: 'Email required.', email: 'Invalid email format.' };
  passwordErrors = { required: 'Password required.', hasUpperCase: 'Password must contain a uppercase character', hasNumber: 'Password must contain a number', hasSpecialChar: 'Password must contain a special character' };
  
  // Getters
  get email() {
    return this.loginForm.controls.email;
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
      this.formSubmitted.emit(this.loginForm.getRawValue() as { email: string; password: string });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

// Password must contain a uppercase character
function hasUpperCase(control: AbstractControl): ValidationErrors | null {
  const password = control.value as string || '';
  
  return /[A-Z]/.test(password) ? null : { hasUpperCase: true };
};

// Password must contain a number character
function hasNumber(control: AbstractControl): ValidationErrors | null {
  const password = control.value as string || '';

  return /\d/.test(password) ? null : { hasNumber: true };
};

// Password must contain a special character
function hasSpecialChar(control: AbstractControl): ValidationErrors | null {
  const password = control.value as string || '';

  return /[!@#$%^&*(),.?":{}|<>]/.test(password) ? null : { hasSpecialChar: true };
};