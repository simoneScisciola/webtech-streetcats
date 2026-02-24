import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { catchError, EMPTY, Observable, Subscription, switchMap, tap, timer } from 'rxjs';
import { toast } from 'ngx-sonner';

import { RestBackend } from '#core/services/rest-backend/rest-backend'
import { SightingResponse, SightingItem } from '#types/sighting';
import { PaginatedResponse } from '#shared/types/pagination';
import { formatDate, formatTime } from '#shared/utils/date';

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
  readonly sightings = signal<SightingItem[]>([]);
  readonly isLoading = signal(false);
  readonly lastUpdated = signal<Date | null>(null);

  // Computed signals
  readonly lastUpdatedFormatted = computed(() => this.formatTime(this.lastUpdated()));

  // Utils
  
  // Date formatting
  private readonly formatDate = formatDate;

  // Time formatting
  private readonly formatTime = formatTime;

  // Methods

  /**
   * Stop polling on component destroy
   */
  ngOnDestroy(): void {
    this.stopPolling();
  }

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
              console.error('Sightings sync failed.', err);
              this.isLoading.set(false);
              toast.error('Sightings sync failed.');
              return EMPTY;
            })
          )
        ),
      ).subscribe((response) => { // Manages getAll() response
        this.sightings.set(response.data.map(raw => this.toSightingItem(raw))); // Map raw API response to UI-ready SightingItem
        this.isLoading.set(false);
        this.lastUpdated.set(new Date());
        toast.success('Sightings synced successfully.');
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

  /** Maps a raw API response to a UI-ready SightingItem. */
  toSightingItem(raw: SightingResponse): SightingItem {
    return {
      ...raw,
      latitude: Number.parseFloat(raw.latitude),
      longitude: Number.parseFloat(raw.longitude),
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
      formattedCreatedAt: this.formatDate(new Date(raw.createdAt)),
      formattedUpdatedAt: this.formatTime(new Date(raw.updatedAt)),
    };
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