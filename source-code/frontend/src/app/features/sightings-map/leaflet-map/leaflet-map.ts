import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, inject, effect, Output, EventEmitter, ApplicationRef, EnvironmentInjector, ComponentRef, createComponent, Type } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import * as L from 'leaflet';

import { Sighting } from '#core/services/sighting/sighting';
import { Auth } from '#core/services/auth/auth';
import { GeoCoords } from '#shared/types/coordinates';
import { SightingsMapState } from '#features/sightings-map/sightings-map-state/sightings-map-state';
import { SightingItem } from '#types/sighting';
import { MapPopup } from './map-popup/map-popup';
import { MarkerPopup } from './marker-popup/marker-popup';

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.html',
  styleUrl: './leaflet-map.scss',
})
export class LeafletMap implements AfterViewInit, OnDestroy, OnChanges {

  /** Triggers map resize based on panel state */
  @Input() isPanelOpen = false;

  /** Emitted when the user clicks the map while `isPickingCoordinates` is true and when the user selects "Add sighting" from the right-click context menu. */
  @Output() coordinatesPicked = new EventEmitter();

  // -- State and Signals -----------------------------------------------------

  /** Leaflet map instance */
  private map?: L.Map;

  /** Timeout before Leaflet resize notification */
  private resizeTimeout?: any;

  /** Map of sighting IDs -> Leaflet markers for efficient updates */
  private readonly markersMap = new Map<number, L.Marker>();

  /**
   * Mirror of the current sightings indexed by ID.
   * Needed to re-open the Angular popup from `focusMarker`, which only has access to the marker and not to the original sighting data.
   */
  private readonly sightingsById = new Map<number, SightingItem>();

  /** Tracks whether the initial sync has already been performed. */
  private isFirstSync = true;

  /**
   * Reference to the currently open MapPopup Angular component (context-menu popup).
   * Kept so it can be destroyed when a new right-click occurs or on `ngOnDestroy`.
   */
  private mapPopupComponentRef?: ComponentRef<MapPopup>;

  /**
   * Reference to the currently open MarkerPopup Angular component (marker click popup).
   * Kept so it can be destroyed when another marker is clicked or on `ngOnDestroy`.
   */
  private markerPopupComponentRef?: ComponentRef<MarkerPopup>;

  /** Temporary marker showing the coordinates selected in the form. */
  private previewMarker?: L.Marker;

  /** Currently focused marker. */
  private focusedMarker?: L.Marker;

  /** Custom icon for the preview marker. */
  private readonly previewIcon = L.icon({
    iconUrl: 'assets/leaflet/preview-marker-icon.png',
    iconRetinaUrl: 'assets/leaflet/preview-marker-icon-2x.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  /** Default Leaflet marker icon. */
  private readonly defaultIcon = L.icon({
    iconUrl: 'assets/leaflet/marker-icon.png',
    iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  /** Icon used when a marker is focused. */
  private readonly focusedIcon = L.icon({
    iconUrl: 'assets/leaflet/focus-marker-icon.png',
    iconRetinaUrl: 'assets/leaflet/focus-marker-icon-2x.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // -- Dependency Injection --------------------------------------------------

  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly sighting = inject(Sighting);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly sightingsMapState = inject(SightingsMapState);

  // -- Constructor -----------------------------------------------------------

  constructor() {
    // Sync markers whenever `sightings` signal changes
    effect(() => {
      const sightings = this.sighting.sightings();
      if (this.map) {
        this.syncMarkers(sightings);
      }
    });

    // Sync preview marker whenever `previewCoordinates` signal changes
    effect(() => {
      const coords = this.sightingsMapState.previewCoordinates();
      if (this.map) {
        this.syncPreviewMarker(coords);
      }
    });

    // Update cursor style when user enters and leaves "pick coordinates" mode
    effect(() => {
      const isPicking = this.sightingsMapState.isPickingCoordinates();
      if (this.map) {
        this.map.getContainer().style.cursor = isPicking ? 'crosshair' : ''; // Toggle crosshair cursor to visually signal picking mode
      }
    });

    // Move to the marker and open its popup when a sighting card is clicked
    effect(() => {
      const coords = this.sightingsMapState.focusCoordinates();
      if (coords && this.map) {
        this.focusMarker(coords);
        this.sightingsMapState.clearFocusCoordinates(); // Consume the signal so future clicks on the same coords still trigger the effect
      }
    });
  }

  // -- Lifecycle -------------------------------------------------------------

  /**
   * Initialize Leaflet map.
   * Executed right after DOM building completion.
   */
  ngAfterViewInit(): void {
    this.initMap();
    this.syncMarkers(this.sighting.sightings());
  }

  /**
   * Executed every time an `@Input` value changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    // If `isPanelOpen` changed and the map is initialised, resize
    if (changes['isPanelOpen'] && this.map) {
      console.log('isPanelOpen changed:', this.isPanelOpen);

      // Reset timeout
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }

      // Resize map after sidebar CSS transition ends
      this.resizeTimeout = setTimeout(() => {
        this.map?.invalidateSize();
      }, 350); // Time in ms
    }
  }

  /**
   * Executed when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    // Destroy any open Angular popup components to prevent memory leaks
    this.destroyComponent(this.mapPopupComponentRef);
    this.destroyComponent(this.markerPopupComponentRef);

    this.map?.remove();
  }

  // -- Map management --------------------------------------------------------

  /**
   * Initialises Leaflet map.
   */
  private initMap(): void {

    // Initialise map and fit to Europe/Italy bounds
    this.map = L.map('map');
    this.map.fitBounds([[30, -29], [55, 55]]);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // === Map Listeners === //

    // Click listener: used in coordinate-picking mode
    this.map.on('click', (e: L.LeafletMouseEvent) => {

      if (this.sightingsMapState.isPickingCoordinates()) {
        this.sightingsMapState.setPreviewCoordinates({ latitude: e.latlng.lat, longitude: e.latlng.lng }, 'map');
        this.coordinatesPicked.emit();
      }

    });

    // Right-click listener: open a context-menu popup with a dynamic Angular component
    this.map.on('contextmenu', (e: L.LeafletMouseEvent) => this.openMapPopup(e.latlng));

  }

  // -- Markers management ----------------------------------------------------

  /**
   * Sync markers on map by deleting markers that are no longer in the sightings list and adding new ones.
   * On the first sync with data, fits the viewport to show all markers.
   * @param sightings Current list of sightings from the service.
   */
  private syncMarkers(sightings: SightingItem[]): void {

    // If there's no map
    if (!this.map)
      return;

    // Convert incoming sightings to a set of IDs for easy lookup
    const incomingIds = new Set(sightings.map(s => s.id));

    // Remove markers and cached sighting data that are no longer in the list
    for (const [id, marker] of this.markersMap.entries()) {
      if (!incomingIds.has(id)) {
        marker.remove();
        this.markersMap.delete(id);
        this.sightingsById.delete(id); // Keep sightingsById in sync with markersMap
      }
    }

    // For each sighting
    for (const sighting of sightings) {

      // Cache the sighting data by ID so focusMarker can retrieve it later
      this.sightingsById.set(sighting.id, sighting);

      // If it isn't in the markerMap (so it is not yet on map)
      if (!this.markersMap.has(sighting.id)) {
        const marker = L.marker(
          [sighting.latitude, sighting.longitude],
          { icon: this.defaultIcon }
        ).addTo(this.map);

        // === Marker Listeners === //

        // Open the Angular MarkerPopup component when this marker is clicked
        marker.on('click', () => this.openMarkerPopup(marker, marker.getLatLng(), sighting));

        // Add marker to map
        this.markersMap.set(sighting.id, marker);
      }

    }

    // On the first sync that contains markers, fit the viewport to include all of them
    if (this.isFirstSync && sightings.length > 0) {
      const bounds = L.latLngBounds(
        sightings.map(sighting => [sighting.latitude, sighting.longitude] as L.LatLngTuple)
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
      this.isFirstSync = false;
    }

  }

  /**
   * Adds, moves, or removes the temporary preview marker.
   * It builds a draggable marker that automatically updates coordinates.
   * @param coords Coordinates to preview, or null to remove the marker.
   */
  private syncPreviewMarker(coords: GeoCoords | null): void {

    // Always remove the existing marker first
    this.previewMarker?.remove();
    this.previewMarker = undefined;

    if (coords !== null) {
      // Place the custom icon marker at the selected coordinates
      this.previewMarker = L.marker(
        [coords.latitude, coords.longitude],
        {
          icon: this.previewIcon,
          draggable: true
        }
      ).addTo(this.map!);

      // === Marker Listeners === //

      // When drag ends, update coordinates
      this.previewMarker.on('dragend', () => {
        const position = this.previewMarker!.getLatLng();
        this.sightingsMapState.setPreviewCoordinates({ latitude: position.lat, longitude: position.lng }, 'map');
        this.coordinatesPicked.emit();
      });
    }

  }

  /**
   * Moves the map to the marker matching `coords`, then opens its Angular popup.
   * @param coords Target coordinates from the state.
   */
  private focusMarker(coords: GeoCoords): void {

    // Find the marker whose position matches the requested coordinates
    const target = [...this.markersMap.values()].find(marker => {
      const position = marker.getLatLng();
      return position.lat === coords.latitude && position.lng === coords.longitude;
    });

    // If a marker is found, smoothly animate the map to the marker, then open its popup once the animation ends
    if (target && this.map) {
      // Find the sighting ID associated with this marker to retrieve its data
      const sightingId = [...this.markersMap.entries()].find(([, m]) => m === target)?.[0];
      const sighting = sightingId === undefined ? undefined : this.sightingsById.get(sightingId);

      this.map.flyTo(target.getLatLng(), 12, { duration: 0.6 }); // Use `flyTo` for a smooth animated transition

      // Open the Angular popup after the fly animation completes
      this.map.once('moveend', () => {
        if (sighting) {
          this.openMarkerPopup(target, target.getLatLng(), sighting);
        }
      });
    }
  }

  /**
   * Restores the default icon on the previously focused marker and applies the focused icon to the new one. Keeps `focusedMarker` up to date.
   * @param marker The marker to focus.
   */
  private setFocusedMarker(marker: L.Marker): void {

    // Restore default icon on previously focused marker
    if (this.focusedMarker) {
      this.focusedMarker.setIcon(this.defaultIcon);
    }

    // Apply focused icon to the new target
    marker.setIcon(this.focusedIcon);

    // Update the reference to the currently focused marker
    this.focusedMarker = marker;
  }

  /**
   * Clears the focused marker state, restoring its default icon and setting `focusedMarker` to undefined.
   * @param marker The marker whose focus state should be cleared.
   */
  private clearFocusedMarker(marker: L.Marker): void {
    marker.setIcon(this.defaultIcon);
    this.focusedMarker = undefined;
  }

  // -- Popup management ------------------------------------------------------

  /**
   * Destroys any previously open MapPopup, then creates a new `MapPopup` Angular component and opens it as a Leaflet popup on the context-menu.
   * @param latlng Where the popup will be anchored on the map. 
   */
  private openMapPopup(latlng: L.LatLng): void {

    // Destroy any previously open context-menu popup before creating a new one
    this.destroyComponent(this.mapPopupComponentRef);

    // Instantiate the `MapPopup` Angular component
    const { popup, componentRef } = this.createAngularPopup(
      MapPopup,
      latlng,
      (compRef) => {
        // Pass authentication state Input
        compRef.setInput('isAuthenticated', this.auth.isAuthenticated());

        // Subscribe to the "Add sighting" button Output
        compRef.instance.addSightingClick.subscribe(() => {
          if (!this.auth.isAuthenticated()) {
            toast.error('You must be logged in to add a sighting.');
            return;
          }

          this.map?.closePopup();
          this.sightingsMapState.setPreviewCoordinates({ latitude: latlng.lat, longitude: latlng.lng }, 'map');
          this.coordinatesPicked.emit();
        });
      },
      (compRef) => {
        // Clear the tracker only if it still points to this instance
        if (this.mapPopupComponentRef === compRef) {
          this.mapPopupComponentRef = undefined;
        }
      }
    );

    // Track the new instance so it can be destroyed on the next right-click or on destroy
    this.mapPopupComponentRef = componentRef;
    popup.openOn(this.map!);

  }

  /**
   * Destroys any previously open MarkerPopup, then creates a new `MarkerPopup` Angular component and opens it as a Leaflet popup on the given marker.
   * Also manages the focused-marker icon state.
   * @param marker The Leaflet marker that was clicked or focused.
   * @param latlng Where the popup will be anchored on the map. 
   * @param sighting The sighting data to pass to the popup component.
   */
  private openMarkerPopup(marker: L.Marker, latlng: L.LatLng, sighting: SightingItem): void {

    // Destroy the previous marker popup before opening a new one
    this.destroyComponent(this.markerPopupComponentRef);

    const { popup, componentRef } = this.createAngularPopup(
      MarkerPopup,
      latlng,
      (compRef) => {
        // Pass title Input
        compRef.setInput('title', sighting.title);

        // Pass createdAt Input
        compRef.setInput('createdAt', sighting.formattedCreatedAt);

        // Subscribe to the "Add sighting" button Output
        compRef.instance.detailsClick.subscribe(() => {
          this.onMarkerPopupDetailsClick(sighting.id);
        });
      },
      (compRef) => {
        // On popup removal: clear the tracker and restore the default marker icon
        if (this.markerPopupComponentRef === compRef) {
          this.markerPopupComponentRef = undefined;
        }
        this.clearFocusedMarker(marker);
      }
    );

    // Highlight the marker while its popup is open
    this.setFocusedMarker(marker);

    // Track the new instance so it can be destroyed on the next click or on destroy
    this.markerPopupComponentRef = componentRef;
    popup.openOn(this.map!);
  }

  /**
   * Navigates to the details page for a specific sighting.
   * @param sightingId The ID of the sighting to navigate to.
   */
  onMarkerPopupDetailsClick(sightingId: number): void {
    this.router.navigate(['/sighting', sightingId, 'details']);
  }

  /**
   * Factory that creates a dynamic Angular component, mounts it into the ApplicationRef, wraps it in a Leaflet popup, and registers a cleanup callback for when the popup is removed from the map.
   * @param ComponentClass The Angular component class to instantiate.
   * @param latlng Where the popup will be anchored on the map.
   * @param configureInputOutput Optional callback to set inputs / subscribe to outputs on the new ComponentRef.
   * @param onRemove Optional callback invoked when Leaflet removes the popup.
   * @returns The Leaflet popup and the Angular ComponentRef.
   */
  private createAngularPopup<T>(ComponentClass: Type<T>, latlng: L.LatLng, configureInputOutput?: (ref: ComponentRef<T>) => void, onRemove?: (ref: ComponentRef<T>) => void): { popup: L.Popup; componentRef: ComponentRef<T> } {

    // Instantiate the Angular component (it'll be outside the normal component tree)
    const componentRef = createComponent(ComponentClass, {
      environmentInjector: this.envInjector,
    });

    // Allow the caller to set inputs and subscribe to outputs
    configureInputOutput?.(componentRef);

    // Attach to ApplicationRef so Angular runs change detection on it
    this.appRef.attachView(componentRef.hostView);

    // Force initial rendering so the DOM element is ready before Leaflet reads it
    componentRef.changeDetectorRef.detectChanges();

    // Build the Leaflet popup using the Angular component's rendered DOM element as content
    const popup = L.popup({ closeButton: true })
      .setLatLng(latlng)
      .setContent(componentRef.location.nativeElement);

    // When Leaflet removes the popup, destroy the Angular component to prevent memory leaks and invoke a optional callback
    popup.on('remove', () => {
      this.destroyComponent(componentRef);
      onRemove?.(componentRef);
    });

    return { popup, componentRef };
  }

  /**
   * Detaches and destroys a dynamic component in order to prevent memory leaks.
   * Safe to call when `componentRef` is undefined.
   * @param componentRef The ComponentRef to destroy, or undefined.
   */
  private destroyComponent(componentRef?: ComponentRef<any>): void {
    if (componentRef) {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }
  }

}