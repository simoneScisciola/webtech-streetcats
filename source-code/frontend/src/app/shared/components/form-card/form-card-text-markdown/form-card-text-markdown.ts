import { Component, Input } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEye, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-form-card-text-markdown',
  imports: [ReactiveFormsModule, FontAwesomeModule, MarkdownModule, KeyValuePipe],
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

  // Field labels
  protected readonly icons = {
    preview: faEye,
    edit: faPenToSquare,
  };

  /** Tracks whether the field is in markdown preview mode */
  isPreview = false;

  /**
   * Toggles between textarea edit mode and markdown preview mode.
   * Does nothing if the control is empty and preview is not active.
   */
  togglePreview(): void {
    // Guard: do not enter preview if there is nothing to render
    if (!this.control.value && !this.isPreview)
      return;

    this.isPreview = !this.isPreview;
  }

}