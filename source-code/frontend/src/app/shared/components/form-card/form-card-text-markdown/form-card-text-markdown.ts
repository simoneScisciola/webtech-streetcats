import { Component, Input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-form-card-text-markdown',
  imports: [ReactiveFormsModule, FontAwesomeModule, KeyValuePipe],
  templateUrl: './form-card-text-markdown.html',
  styleUrl: './form-card-text-markdown.scss',
})
export class FormCardTextMarkdown {

  @Input({ required: true }) control!: FormControl; // Associated form control
  @Input({ required: true }) id: string = ''; // Input id
  @Input({ required: true }) label!: string; // Input label
  @Input() icon: IconDefinition | null = null; // Input field icon
  @Input() placeholder = ''; // Input placeholder
  @Input() errors: Record<string, string> = {}; // Map: {validator key, error message}

}