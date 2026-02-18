import { Component, output } from '@angular/core';
import { ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormGroup, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserPlus, faUser, faEnvelope, faLock, faShield } from '@fortawesome/free-solid-svg-icons';

import { FormCard } from '#shared/components/form-card/form-card';
import { FormCardHeader } from '#shared/components/form-card/form-card-header/form-card-header';
import { FormCardBody } from '#shared/components/form-card/form-card-body/form-card-body';
import { FormCardFooter } from '#shared/components/form-card/form-card-footer/form-card-footer';
import { FormField } from '#shared/components/form-field/form-field';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule, FormCard, FormCardHeader, FormCardBody, FormCardFooter, FormField, FontAwesomeModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.scss',
})
export class SignupForm {
  formSubmit = output<{ username: string; email: string; password: string }>();

  icons = { signup: faUserPlus, user: faUser, email: faEnvelope, lock: faLock, shield: faShield };

  signupForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3)]),
    email: new FormControl('', [
        Validators.required,
        Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)]),
    confirmPassword: new FormControl('', 
      [Validators.required])
  },
  {
    validators: passwordMatchValidator,
  });

  usernameErrors = {
    required:  'Username obbligatorio.',
    minlength: 'Minimo 3 caratteri.',
  };
  emailErrors = {
    required: 'Email obbligatoria.',
    email:    'Formato email non valido.',
  };
  passwordErrors = {
    required:  'Password obbligatoria.',
    minlength: 'Minimo 8 caratteri.',
  };
  confirmErrors = {
    required:         'Conferma la password.',
    passwordMismatch: 'Le password non coincidono.',
  };

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.getRawValue();
      this.formSubmit.emit({ username: username!, email: email!, password: password! });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  get username()        { return this.signupForm.controls.username; }
  get email()           { return this.signupForm.controls.email; }
  get password()        { return this.signupForm.controls.password; }
  get confirmPassword() { return this.signupForm.controls.confirmPassword; }

  // Inietta l'errore di gruppo nel campo confirmPassword
  get confirmControl() {
    const ctrl = this.confirmPassword;
    if (this.signupForm.hasError('passwordMismatch') && ctrl.touched) {
      ctrl.setErrors({ passwordMismatch: true });
    }
    return ctrl;
  }
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm  = control.get('confirmPassword')?.value;

  return password === confirm ? null : { passwordMismatch: true };
}