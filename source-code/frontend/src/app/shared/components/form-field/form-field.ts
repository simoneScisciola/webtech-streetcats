import { Component, input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-form-field',
  imports: [ReactiveFormsModule, FontAwesomeModule, KeyValuePipe],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {
  control      = input.required<FormControl>();
  label        = input.required<string>();
  id           = input.required<string>();
  type         = input<string>('text');
  placeholder  = input<string>('');
  icon         = input<IconDefinition | null>(null);
  // Mappa chiave validatore → messaggio di errore
  errors       = input<Record<string, string>>({});
}