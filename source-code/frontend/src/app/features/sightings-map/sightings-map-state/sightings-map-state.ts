import { Injectable, OnDestroy, computed, inject, signal } from '@angular/core';
import { catchError, EMPTY, Subscription, switchMap, tap, timer } from 'rxjs';
import { toast } from 'ngx-sonner';

import { GeoCoords } from '#shared/types/coordinates';
import { Sighting } from '#core/services/sighting/sighting';
import { SightingResponse, SightingViewModel } from '#shared/types/sighting';
import { Sort } from '#shared/types/query-params';
import { formatTime } from '#shared/utils/date';

/** Polling interval in milliseconds */
const POLL_INTERVAL_MS = 60_000; // 60 seconds

/**
 * Local UI state for the SightingsMap feature.
 * Provided at component level — created and destroyed with SightingsMap.
 */
@Injectable()
export class SightingsMapState implements OnDestroy {

  // -- Dependency Injection --------------------------------------------------

  private readonly sightingService = inject(Sighting);

  // -- State and Signals -----------------------------------------------------

  private pollSubscription?: Subscription;

  /** List of sightings for the current page */
  readonly sightings = signal<SightingResponse[]>([]);

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

  /**
   * Coordinates currently shown as a temporary preview marker on the map and used to pre-fill the add-sighting form.
   * Null when no preview is active.
   */
  private readonly _previewCoordinates = signal<GeoCoords | null>(null);

  /**
   * Coordinates the map should move to when a sighting card is clicked.
   * Null when no focus is requested.
   */
  private readonly _focusCoordinates = signal<GeoCoords | null>(null);

  /**
   * Keeps track of the user in "pick coordinate from map" mode.
   * When true, the map click saves point coordinates instead of being ignored.
   */
  private readonly _isPickingCoordinates = signal(false);

  // Readonly derived state
  readonly previewCoordinates = this._previewCoordinates.asReadonly();
  readonly focusCoordinates = this._focusCoordinates.asReadonly();
  readonly isPickingCoordinates = this._isPickingCoordinates.asReadonly();

  // -- Utils -----------------------------------------------------------------

  private readonly formatTime = formatTime;

  // -- Computed signals ------------------------------------------------------

  readonly lastUpdatedFormatted = computed(() => this.formatTime(this.lastUpdated()));

  /** UI-ready sightings derived from raw API data. */
  readonly sightingsVM = computed<SightingViewModel[]>(
    () => this.sightings().map(s => this.sightingService.toSightingViewModel(s))
  );

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
          this.sightingService.getAll(this.currentSort(), this.currentPage(), this.pageSize()).pipe(
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
        this.sightings.set(response.data);

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

  // -- Methods ---------------------------------------------------------------

  /**
   * Called by the form when the user wants to pick coordinates from the map.
   * Activates crosshair cursor on the map.
   */
  startPicking() {
    this._isPickingCoordinates.set(true);
  }

  /**
   * Called when the user cancels coordinate picking.
   */
  stopPicking() {
    this._isPickingCoordinates.set(false);
  }

  /**
   * Sets the preview coordinates.
   * @param coords The coordinates to set as preview, or null to clear the preview.
   * @param source The source of the coordinates
   */
  setPreviewCoordinates(coords: GeoCoords | null, source: 'map' | 'form') {
    this._previewCoordinates.set(coords);
  }

  /**
   * Clears the preview coordinates, removing any temporary marker from the map and clearing the form pre-fill.
   */
  clearPreviewCoordinates() {
    this._previewCoordinates.set(null);
  }

  /**
   * Sets the focusOn coordinates.
   * Typically called when the user clicks a sighting card, it requests the map to move to the given coordinates.
   * @param coords Target coordinates to focus on.
   */
  focusOnCoordinates(coords: GeoCoords) {
    this._focusCoordinates.set(coords);
  }

  /**
   * Clears the focus coordinates.
   */
  clearFocusCoordinates() {
    this._focusCoordinates.set(null);
  }

}