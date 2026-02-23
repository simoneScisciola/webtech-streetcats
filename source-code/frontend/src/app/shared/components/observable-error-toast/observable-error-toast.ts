import { Component, Input } from '@angular/core';

/**
 * Standalone toast component displayed when an observable errors.
 * Renders the error message and an optional retry button.
 */
@Component({
  selector: 'app-observable-error-toast',
  imports: [],
  templateUrl: './observable-error-toast.html',
  styleUrl: './observable-error-toast.scss',
})
export class ObservableErrorToast {

  /** The error message to display inside the toast. */
  @Input({ required: true }) message!: string;

  /**
   * Optional retry callback. When provided:
   * - The retry button is rendered;
   * - Clicking it invokes this function directly.
   */
  @Input() onRetry?: () => void;

}