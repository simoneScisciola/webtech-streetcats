import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { catchError, EMPTY, Observable, Subscription, switchMap, tap, timer } from 'rxjs';

import { RestBackend } from '#core/services/rest-backend/rest-backend'
import { SightingResponse } from '#types/sighting';
import { PaginatedResponse } from '#shared/types/pagination';

// Config constants
const POLL_INTERVAL_MS = 60_000; // 60 seconds

@Injectable({
  providedIn: 'root',
})
export class Sighting implements OnDestroy {

  // Dependency Injection

  private readonly restBackend = inject(RestBackend);
  
  // State

  // Signals
  private pollSubscription?: Subscription;
  readonly sightings = signal<SightingResponse[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastUpdated = signal<Date | null>(null);

  // Computed signals
  readonly lastUpdatedFormatted = computed(() => {
    const date = this.lastUpdated();

    if (!date) return null;

    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  // Methods

  /**
   * Starts polling the backend automatically.
   */
  startPolling(): void {
    // If polling is already running 
    if (this.pollSubscription)
      return;

    // If no polling is set
    this.pollSubscription = timer(0, POLL_INTERVAL_MS) // Start timer immediately, then emit every POLL_INTERVAL_MS 
      .pipe( // Apply, in sequence, multiple RxJS operators to Observable
        // On every Observer emit:
        tap(() => this.isLoading.set(true)), // Set loading state
        switchMap(() => // Calls getAll() and switches to the new Observable, cancelling any previous one if still active
          this.getAll().pipe(
            catchError((err) => { // Handle errors from getAll(). We use catchError() since we must return a Observable in order to continue polling even after an error
              console.error('Get sightings failed.', err);
              this.error.set('Sightings refresh failed.');
              this.isLoading.set(false);
              return EMPTY;
            })
          )
        ),
      ).subscribe((response) => { // Manages getAll() response
        this.sightings.set(response.data);
        this.isLoading.set(false);
        this.error.set(null);
        this.lastUpdated.set(new Date());
      });
  }

  /**
   * Stop started polling
   */
  stopPolling(): void {
    this.pollSubscription?.unsubscribe();
    this.pollSubscription = undefined;
  }

  /**
   * Manually reset the polling interval (e.g. after a manual refresh)
   */
  refresh(): void {
    this.stopPolling();
    this.startPolling();
  }

  /**
   * Stop polling on component destroy
   */
  ngOnDestroy(): void {
    this.stopPolling();
  }

  // CRUD Methods

  /**
   * Create of a sighting
   * POST /sightings
   */
  create(payload: FormData): Observable<SightingResponse> {
    return this.restBackend.uploadForm(
      `/sightings`,
      'POST',
      payload
    );
  }

  /**
   * Get one sighting by id
   * GET /sightings/:id
   */
  getOne(id: number): Observable<SightingResponse> {
    return this.restBackend.request(
      `/sightings/${id}`,
      'GET'
    );
  }

  /**
   * Get the full URL of a sighting photo from its relative URL
   * @param photoUrl relative URL of the photo (e.g. /uploads/sightings/20240601-sighting-abc123.jpg)
   * @returns full URL of the photo
   */
  getRequestPhotoUrl(photoUrl: string): string {
    return `${this.restBackend.baseUrl}${photoUrl}`;
  }

  /**
   * Get all sightings
   * GET /sightings
   */
  getAll(page = 0, size = 20): Observable<PaginatedResponse<SightingResponse>> {
    return this.restBackend.request(
      `/sightings?page=${page}&size=${size}`,
      'GET'
    );
  }

  /**
   * Partial update of a sighting
   * PATCH /sightings/:id
   */
  update(id: number, payload: FormData): Observable<SightingResponse> {
    return this.restBackend.uploadForm(
      `/sightings/${id}`,
      'PATCH',
      payload
    );
  }

  /**
   * Delete of a sighting
   * DELETE /sightings/:id
   */
  delete(id: number): Observable<void> {
    return this.restBackend.request(
      `/sightings/${id}`,
      'DELETE'
    );
  }

}