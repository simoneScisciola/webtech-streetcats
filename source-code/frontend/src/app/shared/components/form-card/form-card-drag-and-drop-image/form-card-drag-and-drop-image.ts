import { Component, inject, signal, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faImage, faXmark, faUpload } from '@fortawesome/free-solid-svg-icons';
import { KeyValuePipe } from '@angular/common';

import { ImageUpload } from '#core/services/image-upload/image-upload'

@Component({
  selector: 'app-form-card-drag-and-drop-image',
  imports: [FontAwesomeModule, KeyValuePipe],
  templateUrl: './form-card-drag-and-drop-image.html',
  styleUrl: './form-card-drag-and-drop-image.scss',
})
export class FormCardDragAndDropImage {

  private readonly imageUpload = inject(ImageUpload);

  @Input({ required: true }) control!: FormControl; // Associated form control
  @Input({ required: true }) id: string = ''; // Input id
  @Input({ required: true }) label!: string; // Input label
  @Input() icon: IconDefinition | null = null; // Input field icon
  @Input() errors: Record<string, string> = {}; // Map: {validator key, error message}

  // Signals
  protected readonly preview = signal<string | null>(null);
  protected readonly fileName = signal<string | null>(null);
  protected readonly isDragging = signal(false);
  protected readonly error = signal<string | null>(null);

  // Field labels
  protected readonly icons = {
    remove: faXmark,
    upload: faUpload,
    file: faImage
  };

  /**
   * Processes both "click" and "drag and drop" events through processEvent.
   * @param event 
   */
  async onFileInputChange(event: Event): Promise<void> {
    await this.processEvent(event);
  }

  /**
   * Reset "drag" state
   * @param event 
   */
  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    this.isDragging.set(false);
    await this.processEvent(event);
  }

  /**
   * Enables UI effect when a file is dragged over input area.
   * @param event 
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  /**
   * Disables UI effect when a file over input area is dragged out.
   */
  onDragLeave(): void {
    this.isDragging.set(false);
  }

  /**
   * Manages file remove.
   * @param event 
   * @param fileInput 
   */
  onRemove(event: MouseEvent, fileInput: HTMLInputElement): void {
    event.stopPropagation();
    fileInput.value = '';

    // Reset UI
    this.preview.set(null);
    this.fileName.set(null);
    this.error.set(null);

    // Reset from
    this.control.setValue(null);
    this.control.markAsTouched();
  }

  /**
 * Handles both file input change and drag-and-drop events for photo upload. This method delegates file extraction and validation to the ImageUpload service.
 * @param event
 * @returns A Promise that resolves when the event has been fully processed and the UI/form state updated.
 */
  private async processEvent(event: Event | DragEvent): Promise<void> {

    const result = await this.imageUpload.processEvent(event);

    // Error
    if (!result.success) {

      // Reset UI
      this.error.set(result.error.message);
      this.preview.set(null);
      this.fileName.set(null);

      // Reset form
      this.control.setValue(null);
      this.control.markAsTouched();
      return;
    }

    // Success
    // Update UI
    this.error.set(null);
    this.preview.set(result.data.preview);
    this.fileName.set(result.data.file.name);

    // Update form
    this.control.setValue(result.data.file);
    this.control.markAsTouched();
  }
}