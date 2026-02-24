import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, inject, effect, Output, EventEmitter, ApplicationRef, EnvironmentInjector, ComponentRef, createComponent } from '@angular/core';
import * as L from 'leaflet';

import { Sighting } from '#core/services/sighting/sighting';
import { GeoCoords } from '#shared/types/coordinates';
import { SightingsMapState } from '#features/sightings-map/sightings-map-state/sightings-map-state';
import { SightingResponse } from '#types/sighting';
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
  private popupComponentRef?: ComponentRef<MapPopup>;

  /** Temporary marker showing the coordinates selected in the form. */
  private previewMarker?: L.Marker;

  /** Custom icon for the temporary preview marker. */
  private readonly previewIcon = L.icon({
    iconUrl: 'assets/leaflet/temporary-marker-icon.png',
    iconRetinaUrl: 'assets/leaflet/temporary-marker-icon-2x.png',
    iconSize: [25, 41],     // Default Leaflet marker size
    iconAnchor: [12, 41],   // Tip of the pin is at the bottom-centre
    popupAnchor: [1, -34],
  });

  private readonly sighting = inject(Sighting);
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);
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
  }

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
    this.destroyComponent(this.popupComponentRef);
    this.map?.remove();
  }

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
      this.destroyComponent(this.popupComponentRef);

      // Instantiate the `MapPopup` Angular component
      this.popupComponentRef = createComponent(MapPopup, {
        environmentInjector: this.envInjector,
      });

      // Capture this popup reference in a local const. The local const is what the `remove` closure will reference, ensuring it always destroys exactly this instance even if a later right-click has already replaced `this.popupComponentRef`.
      const componentRef = this.popupComponentRef;

      // Subscribe to the component's output
      componentRef.instance.addSightingClick.subscribe(() => {
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
        if (this.popupComponentRef === componentRef) {
          this.popupComponentRef = undefined;
        }
      });

      popup.openOn(this.map!);

    });

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

      // When drag ends, updated coordinates
      this.previewMarker.on('dragend', () => {
        const position = this.previewMarker!.getLatLng();
        this.sightingsMapState.setPreviewCoordinates({ latitude: position.lat, longitude: position.lng }, 'map');
        this.coordinatesPicked.emit();
      });
    }

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

  /**
   * Sync markers on map by deleting markers that are no longer in the sightings list and adding new ones.
   * On the first sync with data, fits the viewport to show all markers.
   * @param sightings Current list of sightings from the service.
   */
  private syncMarkers(sightings: SightingResponse[]): void {

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

    // Add markers not yet on map
    for (const sighting of sightings) {
      if (!this.markerMap.has(sighting.id)) {
        const marker = L.marker([Number.parseFloat(sighting.latitude), Number.parseFloat(sighting.longitude)])
          .addTo(this.map)
          .bindPopup(`<strong>${sighting.title}</strong><br>${sighting.description ?? ''}`);

        this.markerMap.set(sighting.id, marker);
      }
    }

    // On the first sync that contains markers, fit the viewport to include all of them
    if (this.isFirstSync && sightings.length > 0) {
      const bounds = L.latLngBounds(
        sightings.map(s => [Number.parseFloat(s.latitude), Number.parseFloat(s.longitude)] as L.LatLngTuple)
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
      this.isFirstSync = false;
    }

  }

}