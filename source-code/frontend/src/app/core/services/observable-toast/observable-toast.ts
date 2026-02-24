import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { toast } from 'ngx-sonner';

import { ObservableErrorToast } from '#shared/components/observable-error-toast/observable-error-toast';
import { ObservableToastOptions, ToastStatus } from '#shared/types/observable-toast';

/**
 * Service that tracks the lifecycle of an Observable and reflects it
 * through a sequence of toasts (loading → success | error).
 *
 * Provide it at the **component level** (not root)  so that each component
 * gets its own isolated `status` signal.
 */
@Injectable()
export class ObservableToast {

  // -- State and Signals -----------------------------------------------------

  private readonly status = signal<ToastStatus>('idle');

  // -- Methods ---------------------------------------------------------------

  /**
   * Subscribes to `trackedObservable` and wires its lifecycle to a toast sequence,
   * keeping the `status` in sync with every state transition.
   *
   * @param trackedObservable The observable to track (e.g. an Angular HttpClient call).
   * @param options Toast messages and optional callbacks.
   */
  trigger<T>(trackedObservable: Observable<T>, options: ObservableToastOptions<T>): void {

    // Parse trigger options
    const { loading, success, error, dismissible, duration, onSuccess, onError, onRetry } = options;

    // Mark the operation as started
    this.status.set('loading');
    const loadingId = toast.loading(loading);

    trackedObservable.subscribe({
      next: (data) => {
        // Dismiss the loading toast, then show success
        toast.dismiss(loadingId);
        this.status.set('success');

        toast.success(success);

        onSuccess?.(data);
      },
      error: (err) => {
        // Dismiss the loading toast, then show the custom error component
        toast.dismiss(loadingId);
        this.status.set('error');

        const errorId = toast(ObservableErrorToast, {
          componentProps: {
            message: error,
            // On retry: dismiss this toast and restart the whole lifecycle
            onRetry: () => {
              if (onRetry) {
                toast.dismiss(errorId);
                this.trigger(onRetry(), options);
              }
            },
          },
          dismissible: dismissible ?? true, // Default to dismissible if not specified
          duration: duration ?? 4000, // Default to 4000ms if duration is not specified
        });

        onError?.(err);
      },
    });
  }
}