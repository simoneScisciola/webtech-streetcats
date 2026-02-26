import { Component, inject, Input, TemplateRef } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEye, faPenToSquare, faExpand } from '@fortawesome/free-solid-svg-icons';
import { MarkdownModule } from 'ngx-markdown';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-card-text-markdown',
  imports: [ReactiveFormsModule, FontAwesomeModule, MarkdownModule, KeyValuePipe, NgbModalModule],
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

  /** Field labels & Icons used by the action buttons */
  protected readonly icons = {
    preview: faEye,
    edit: faPenToSquare,
    fullscreen: faExpand,
  };

  /** Tracks whether the field is in markdown preview mode */
  isPreview = false;

  /** Stores the textarea height at any resize event */
  currentTextareaHeight: string | null = null;

  ngbModal = inject(NgbModal);

  /**
   * Saves the current textarea height on mouseup (i.e. after a manual resize drag).
   * @param event The mouseup event fired on the textarea element
   */
  onTextareaMouseUp(event: MouseEvent): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (textarea.style.height) {
      this.currentTextareaHeight = textarea.style.height;
    }
  }

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

  /**
   * Opens the ng-bootstrap modal with the full-screen markdown preview.
   * @param content The ng-template reference passed from the template
   */
  openFullPreview(content: TemplateRef<unknown>): void {
    this.ngbModal.open(content, {
      size: 'xl',
      scrollable: true,
      centered: true
    });
  }

}