import { Component, Input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-form-card-field',
  imports: [ReactiveFormsModule, FontAwesomeModule, KeyValuePipe],
  templateUrl: './form-card-field.html',
  styleUrl: './form-card-field.scss',
})
export class FormCardField {

  @Input({ required: true }) control!: FormControl; // Associated form control
  @Input({ required: true }) id: string = ''; // Input id
  @Input({ required: true }) label!: string; // Input label
  @Input() icon: IconDefinition | null = null; // Input field icon
  @Input() type = 'text'; // Input type
  @Input() placeholder = ''; // Input placeholder
  @Input() errors: Record<string, string> = {}; // Map: {validator key, error message}

}