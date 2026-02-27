import { Injectable } from '@angular/core';
import { fromEvent } from 'file-selector';

import { ImageProcessResult } from '#shared/types/image-upload';

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class ImageUpload {

  // -- Methods ---------------------------------------------------------------

  /**
   * Gets file from Event (input change) or DragEvent (drop), validates the first file found and builds the preview as Data URL.
   * @param event
   * @returns Object containing result state and additional data.
   */
  async processEvent(event: Event | DragEvent): Promise<ImageProcessResult> {

    // Gets file
    const files = await fromEvent(event);
    const file  = files[0] as File | undefined;

    if (!file) { // No file found
      return { success: false, error: { message: 'No file selected.' } };
    }

    // File validation
    const validationError = this.validate(file);
    if (validationError) {
      return { success: false, error: { message: validationError } };
    }

    // Build file preview
    const preview = await this.readAsDataUrl(file);

    return { success: true, data: { file, preview } };
  }

  /**
   * Validates file.
   * Accepts only image file types and files from a specific size range.
   * @param file The file to validate.
   * @returns If successful, nothing. Otherwise, the error message.
   */
  private validate(file: File): string | null {

    // File type validation
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      return 'Only JPG, PNG and WEBP images are allowed.';
    }

    // File size validation
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return 'File exceeds the 5 MB size limit.';
    }

    return null;
  }

  /**
   * Code a file into base64 string.
   * @param file The file to code.
   * @returns The file coded in base64.
   */
  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {

      // Read local file
      const reader  = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file.'));

      // Start reading
      reader.readAsDataURL(file);
    });
  }

}