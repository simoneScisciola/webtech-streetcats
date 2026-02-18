import { Component, output } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightToBracket, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { FormCard } from '../../../shared/components/form-card/form-card';
import { FormField } from '../../../shared/components/form-field/form-field';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, FormCard, FormField, FontAwesomeModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  formSubmit = output<{ email: string; password: string }>();

  icons = { login: faRightToBracket, email: faEnvelope, lock: faLock };

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email]),
    password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)]),
  });

  emailErrors    = { required: 'Email obbligatoria.', email: 'Formato email non valido.' };
  passwordErrors = { required: 'Password obbligatoria.', minlength: 'Minimo 8 caratteri.' };

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.formSubmit.emit(this.loginForm.getRawValue() as { email: string; password: string });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get email()    { return this.loginForm.controls.email; }
  get password() { return this.loginForm.controls.password; }
}