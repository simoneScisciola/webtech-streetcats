import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserPlus, faUser, faEnvelope, faLock, faShield } from '@fortawesome/free-solid-svg-icons';

import { FormCard } from '#shared/components/form-card/form-card';
import { FormCardHeader } from '#shared/components/form-card/form-card-header/form-card-header';
import { FormCardBody } from '#shared/components/form-card/form-card-body/form-card-body';
import { FormCardFooter } from '#shared/components/form-card/form-card-footer/form-card-footer';
import { FormCardField } from '#shared/components/form-card/form-card-field/form-card-field';
import { SignupPayload } from '#types/auth';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule, RouterLink, FormCard, FormCardHeader, FormCardBody, FormCardFooter, FormCardField, FontAwesomeModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {

  @Output() formSubmitted = new EventEmitter<SignupPayload>();

  // Field labels
  icons = {
    signup: faUserPlus,
    user: faUser,
    email: faEnvelope,
    lock: faLock,
    shield: faShield
  };

  // Form
  signupForm = new FormGroup({
    username: new FormControl('', [
      Validators.required]),
    email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/)]),
    password: new FormControl('', [
      Validators.required,
      hasUpperCaseValidator,
      hasNumberValidator,
      hasSpecialCharValidator]),
    confirmPassword: new FormControl('', [
      Validators.required])
  },
  {
    validators: passwordMatchValidator,
  });

  // Error messages
  usernameErrors = {
    required:  'Username required.',
  };
  emailErrors = {
    required: 'Email required.',
    pattern: 'Invalid email format.'
  };
  passwordErrors = {
    required: 'Password required.',
    hasUpperCase: 'Password must contain a uppercase character',
    hasNumber: 'Password must contain a number',
    hasSpecialChar: 'Password must contain a special character'
  };
  confirmErrors = {
    required: 'Confirm password.',
    passwordMismatch: 'Passwords do not match.',
  };

  // Gettes
  get username() {
    return this.signupForm.controls.username;
  }
  get email() {
    return this.signupForm.controls.email; 
  }
  get password() {
    return this.signupForm.controls.password;
  }
  get confirmPassword() {
    return this.signupForm.controls.confirmPassword;
  }

  // Inject passwordMismatch errore in confirmPassword field
  get confirmControl() {
    const control = this.confirmPassword;
    if (this.signupForm.hasError('passwordMismatch') && control.touched) {
      control.setErrors({ passwordMismatch: true });
    }
    return control;
  }

  /**
   * Manages form submit
   */
  onSubmit(): void {
    if (this.signupForm.valid) {
      // Send fields to upper component
      const { username, email, password } = this.signupForm.getRawValue();
      this.formSubmitted.emit({ username: username!, email: email!, password: password! });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}

// Password must contain a uppercase character
function hasUpperCaseValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value as string || '';
  
  return /[A-Z]/.test(password) ? null : { hasUpperCase: true };
};

// Password must contain a number character
function hasNumberValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value as string || '';

  return /\d/.test(password) ? null : { hasNumber: true };
};

// Password must contain a special character
function hasSpecialCharValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value as string || '';

  return /[!@#$%^&*(),.?":{}|<>]/.test(password) ? null : { hasSpecialChar: true };
};

// Password and Confirm password must match
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm  = control.get('confirmPassword')?.value;

  return password === confirm ? null : { passwordMismatch: true };
}
