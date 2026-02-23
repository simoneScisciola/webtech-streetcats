import { Observable } from "rxjs";

/** Possible states of a toast during its lifecycle. */
export type ToastStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Options accepted ObservableToast's `trigger()` method.
 */
export interface ObservableToastOptions<T = unknown> {

  /** Message shown while the observable is pending. */
  loading: string;

  /** Message shown when the observable emits successfully. */
  success: string;

  /** Message shown when the observable errors. */
  error: string;

  /** Whether the error toast can be dismissed by the user. */
  dismissible?: boolean;

  /** How long (ms) the error toast stays visible. Pass `Infinity` to keep it open. */
  duration?: number;

  /** Called with the emitted value when the observable succeeds. */
  onSuccess?: (data: T) => void;

  /** Called with the error when the observable fails. */
  onError?: (err: unknown) => void;

  /**
   * Called when the user clicks "Retry".
   * Must return a new Observable so the lifecycle can restart.
   */
  onRetry?: () => Observable<T>;

}