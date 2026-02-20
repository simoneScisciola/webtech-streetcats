export interface ImageUploadResult {
  file: File;
  preview: string;
}

export interface ImageUploadError {
  message: string;
}

export type ImageProcessResult =
  | { success: true; data: ImageUploadResult }
  | { success: false; error: ImageUploadError };