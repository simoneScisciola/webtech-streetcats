import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { catchError, EMPTY, map, Observable, Subscription, switchMap, tap, timer } from 'rxjs';
import { toast } from 'ngx-sonner';

import { RestBackend } from '#core/services/rest-backend/rest-backend'
import { SightingResponse, SightingViewModel } from '#shared/types/sighting';
import { PaginatedResponse } from '#shared/types/pagination';
import { formatDate, formatRelativeTime, formatTime } from '#shared/utils/date';
import { Sort } from '#shared/types/query-params';

/** Polling interval in milliseconds */
const POLL_INTERVAL_MS = 60_000; // 60 seconds

@Injectable({
  providedIn: 'root',
})
export class Sighting implements OnDestroy {

  // -- Dependency Injection --------------------------------------------------

  private readonly restBackend = inject(RestBackend);

  // -- State and Signals -----------------------------------------------------

  private pollSubscription?: Subscription;

  /** List of sightings for the current page */
  readonly sightingsVM = signal<SightingViewModel[]>([]);

  /** Loading state for the current page */
  readonly isLoading = signal(false);

  /** Timestamp of the last successful sync with the backend */
  readonly lastUpdated = signal<Date | null>(null);

  /** Currently displayed page (0-based index) */
  readonly currentPage = signal(0);

  /** Number of items per page */
  readonly pageSize = signal(20);

  /** Total number of pages returned by the backend */
  readonly totalPages = signal(0);

  /** Total number of items across all pages */
  readonly totalItems = signal(0);

  /** Current selected sort */
  readonly currentSort = signal<Sort>({ field: 'createdAt', direction: 'desc' });

  // -- Computed signals ------------------------------------------------------

  readonly lastUpdatedFormatted = computed(() => this.formatTime(this.lastUpdated()));

  // -- Utils -----------------------------------------------------------------

  private readonly formatDate = formatDate;
  private readonly formatTime = formatTime;
  private readonly formatRelativeTime = formatRelativeTime;

  // -- Lifecycle -------------------------------------------------------------

  /** Stop polling on service destroy */
  ngOnDestroy(): void {
    this.stopPolling();
  }

  // -- Polling ---------------------------------------------------------------

  /**
   * Starts polling the backend automatically.
   * Each tick fetches the page the user is currently viewing.
   */
  startPolling(): void {

    // Do not create a second subscription if already polling
    if (this.pollSubscription)
      return;

    // Start an RxJS timer that ticks immediately and then every POLL_INTERVAL_MS
    this.pollSubscription = timer(0, POLL_INTERVAL_MS)
      .pipe(

        // Set loading state
        tap(() => this.isLoading.set(true)),

        // Call getAll() and switch to the new Observable, cancelling any previous one if still active.
        // We read currentPage() here so that each tick fetches the page the user is currently on.
        switchMap(() =>
          this.getAll(this.currentSort(), this.currentPage(), this.pageSize()).pipe(
            catchError((err) => {
              console.error('Sightings sync failed.', err);
              this.isLoading.set(false);
              toast.error('Sightings sync failed.');
              return EMPTY; // Return EMPTY so the outer timer keeps ticking despite the error
            })
          )
        ),
      )
      .subscribe((response) => {

        // Map API items to UI-ready objects
        this.sightingsVM.set(response.data.map(response => this.toSightingViewModel(response)));

        // Persist pagination metadata for the pagination component
        this.totalPages.set(response.totalPages);
        this.totalItems.set(response.totalItems);

        this.isLoading.set(false);
        this.lastUpdated.set(new Date());
        toast.success('Sightings synced successfully.');
      });
  }

  /** Unsubscribes from the polling timer */
  stopPolling(): void {
    this.pollSubscription?.unsubscribe();
    this.pollSubscription = undefined;
  }

  /**
   * Resets the polling interval.
   * Useful after a manual refresh to avoid an immediate subsequent request.
   */
  refresh(): void {
    this.stopPolling();
    this.startPolling();
  }

  /**
   * Navigates to a specific page and resets the polling interval.
   * The next (and all subsequent) poll ticks will fetch this page.
   * @param page 0-based page index
   */
  goToPage(page: number): void {
    this.currentPage.set(page);
    this.refresh();
  }

  // -- Mapping ---------------------------------------------------------------
      
  /**
   * Normalises a single raw API object into a fully-typed `SightingResponse`.
   * @param raw Untyped object straight from the HTTP layer
   */
  parseRawResponse(raw: any): SightingResponse {
    return {
      ...raw,
      latitude: Number.parseFloat(raw.latitude),
      longitude: Number.parseFloat(raw.longitude),
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt),
    }
  }

  /**
   * Maps a `SightingResponse` (already normalised) to a UI-ready `SightingViewModel`.
   */
  toSightingViewModel(response: SightingResponse): SightingViewModel {
    return {
      ...response,
      formattedCreatedAt: this.formatDate(response.createdAt),
      formattedUpdatedAt: this.formatTime(response.updatedAt),
      relativeCreatedAt: this.formatRelativeTime(response.createdAt),
      relativeUpdatedAt: this.formatRelativeTime(response.updatedAt),
    };
  }

  // -- CRUD ------------------------------------------------------------------

  /**
   * Create a sighting
   * POST /sightings
   */
  create(payload: FormData): Observable<SightingResponse> {
    return this.restBackend.uploadForm(
      `/sightings`,
      'POST',
      payload
    ).pipe(
      map(raw => this.parseRawResponse(raw))
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
    ).pipe(
      map(raw => this.parseRawResponse(raw))
    );
  }

  /**
   * Returns the full URL of a sighting photo from its relative path.
   * @param photoUrl relative URL (e.g. /uploads/sightings/photo.jpg)
   */
  getRequestPhotoUrl(photoUrl: string): string {
    return `${this.restBackend.baseUrl}${photoUrl}`;
  }

  /**
   * Get a paginated list of sightings
   * GET /sightings?page=:page&size=:size
   */
  getAll(sort: Sort, page = 0, size = 20): Observable<PaginatedResponse<SightingResponse>> {
    return this.restBackend.request<PaginatedResponse<SightingResponse>>(
      `/sightings?page=${page}&size=${size}&sort=${sort.field},${sort.direction}`,
      'GET'
    ).pipe(
      map(raw => ({
        ...raw,
        data: raw.data.map(item => this.parseRawResponse(item))
      }))
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
    ).pipe(
      map(raw => this.parseRawResponse(raw))
    );
  }

  /**
   * Delete a sighting
   * DELETE /sightings/:id
   */
  delete(id: number): Observable<void> {
    return this.restBackend.request(
      `/sightings/${id}`,
      'DELETE'
    );
  }

}