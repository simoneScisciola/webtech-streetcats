import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, inject, effect, Output, EventEmitter, ApplicationRef, EnvironmentInjector, ComponentRef, createComponent } from '@angular/core';
import { toast } from 'ngx-sonner';
import * as L from 'leaflet';

import { Sighting } from '#core/services/sighting/sighting';
import { Auth } from '#core/services/auth/auth';
import { GeoCoords } from '#shared/types/coordinates';
import { SightingsMapState } from '#features/sightings-map/sightings-map-state/sightings-map-state';
import { SightingItem } from '#types/sighting';
import { MapPopup } from './map-popup/map-popup';

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.html',
  styleUrl: './leaflet-map.scss',
})
export class LeafletMap implements AfterViewInit, OnDestroy, OnChanges {

  /** Triggers map resize based on panel state */
  @Input() isPanelOpen = false;

  /** Emitted when the user clicks the map while `isPickingCoordinates` is true. */
  @Output() coordinatesPicked = new EventEmitter();

  /** Emitted when the user selects "Add sighting" from the right-click context menu. */
  @Output() addSightingRequested = new EventEmitter();

  /** Leaflet map instance */
  private map?: L.Map;

  /** Timeout before Leaflet resize notification */
  private resizeTimeout?: any;

  /** Map of sighting IDs -> Leaflet markers for efficient updates */
  private readonly markerMap = new Map<number, L.Marker>();

  /** Tracks whether the initial sync has already been performed. */
  private isFirstSync = true;

  /**
   * Reference to the currently open MapPopup Angular component.
   * Kept so it can be destroyed on `ngOnDestroy` if the popup is still open.
   */
  private mapPopupComponentRef?: ComponentRef<MapPopup>;

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

  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly sighting = inject(Sighting);
  private readonly auth = inject(Auth);
  private readonly sightingsMapState = inject(SightingsMapState);

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
    this.destroyComponent(this.mapPopupComponentRef);
    this.map?.remove();
  }

  // -- Methods ---------------------------------------------------------------

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
    this.map.on('contextmenu', (e: L.LeafletMouseEvent) => {

      // Destroy any previously open popup component before creating a new one.
      this.destroyComponent(this.mapPopupComponentRef);

      // Instantiate the `MapPopup` Angular component
      this.mapPopupComponentRef = createComponent(MapPopup, {
        environmentInjector: this.envInjector,
      });

      // Capture this popup reference in a local const. The local const is what the `remove` closure will reference, ensuring it always destroys exactly this instance even if a later right-click has already replaced `this.mapPopupComponentRef`.
      const componentRef = this.mapPopupComponentRef;

      // Set inputs
      componentRef.setInput('isAuthenticated', this.auth.isAuthenticated());

      // Subscribe to the component's output
      componentRef.instance.addSightingClick
        .subscribe(() => {
          if (!this.auth.isAuthenticated()) {
            toast.error('You must be logged in to add a sighting.');
            return;
          }

          this.map?.closePopup();
          this.sightingsMapState.setPreviewCoordinates({ latitude: e.latlng.lat, longitude: e.latlng.lng }, 'map');
          this.addSightingRequested.emit();
        });

      // Attach to ApplicationRef so Angular runs change detection on it
      this.appRef.attachView(componentRef.hostView);

      // Run initial change detection immediately after attaching the view.
      // This forces Angular to render the template before Leaflet takes the nativeElement and inserts it into the DOM popup.
      componentRef.changeDetectorRef.detectChanges();

      // Create the Leaflet popup and bind the Angular component's DOM element as its content
      const popup = L.popup({ closeButton: true })
        .setLatLng(e.latlng)
        .setContent(componentRef.location.nativeElement);

      // Destroy the component when its specific popup is removed.
      // Clear `this.popupComponentRef` only if it still points to this instance, since a later right-click may have already replaced it.
      popup.on('remove', () => {
        this.destroyComponent(componentRef);
        if (this.mapPopupComponentRef === componentRef) {
          this.mapPopupComponentRef = undefined;
        }
      });

      popup.openOn(this.map!);

    });

  }

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

    // Remove markers that are no longer in the sightings list
    for (const [id, marker] of this.markerMap.entries()) {
      if (!incomingIds.has(id)) {
        marker.remove();
        this.markerMap.delete(id);
      }
    }

    // For each sighting
    for (const sighting of sightings) {

      // If it isn't in the markerMap (so it is not yet on map)
      if (!this.markerMap.has(sighting.id)) {
        const marker = L.marker(
          [sighting.latitude, sighting.longitude],
          {
            icon: this.defaultIcon
          }
        )
          .addTo(this.map)
          .bindPopup(`<strong>${sighting.title}</strong><br>${sighting.description ?? ''}`);

        // === Marker Listeners === //

        // Change icon to focused when the marker is clicked directly on the map
        marker.on('popupopen', () => this.setFocusedMarker(marker));

        // Restore default icon when the popup is closed
        marker.on('popupclose', () => this.clearFocusedMarker(marker));

        // Add marker to map
        this.markerMap.set(sighting.id, marker);
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
   * Moves the map to the marker matching `coords` and sets it as focused marker.
   * @param coords Target coordinates from the state.
   */
  private focusMarker(coords: GeoCoords): void {

    // Find the marker whose position matches the requested coordinates
    const target = [...this.markerMap.values()].find(marker => {
      const position = marker.getLatLng();
      return position.lat === coords.latitude && position.lng === coords.longitude;
    });

    // If a marker is found, smoothly animate the map to the marker, then open its popup once the animation ends
    if (target && this.map) {
      this.map.flyTo(target.getLatLng(), 12, { duration: 0.6 }); // Use `flyTo` for a smooth animated transition.

      // Set new focused marker and open popup
      this.map.once('moveend', () => {
        target.openPopup();
        this.setFocusedMarker(target);
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
   */
  private clearFocusedMarker(marker: L.Marker): void {
    marker.setIcon(this.defaultIcon);
    this.focusedMarker = undefined;
  }

  /**
   * Detaches and destroys a dynamic component in order to prevent memory leaks.
   * Safe to call when `componentRef` is undefined.
   */
  private destroyComponent(componentRef?: ComponentRef<any>): void {
    if (componentRef) {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }
  }

}