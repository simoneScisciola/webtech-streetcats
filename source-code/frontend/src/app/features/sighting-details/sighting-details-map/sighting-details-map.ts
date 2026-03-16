import { Component, Input, AfterViewInit, OnChanges, OnDestroy, SimpleChanges, inject, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

import { Leaflet } from '#core/services/leaflet/leaflet';
import { GeoCoords } from '#shared/types/coordinates';

@Component({
  selector: 'app-sighting-details-map',
  imports: [],
  templateUrl: './sighting-details-map.html',
  styleUrl: './sighting-details-map.scss',
})
export class SightingDetailsMap implements AfterViewInit, OnChanges, OnDestroy {

  @Input({ required: true }) latitude!: number;
  @Input({ required: true }) longitude!: number;
  @Input() address: string | null = null;
  @Input() isEditMode = false;

  /** Emitted when the user drags the marker to a new position */
  @Output() coordinatesPicked = new EventEmitter<GeoCoords>();

  // -- State and Signals -----------------------------------------------------

  /** Leaflet map instance */
  private map?: L.Map;

  /** Marker instance */
  private marker?: L.Marker;

  // -- Dependency Injection --------------------------------------------------

  private readonly leafletService = inject(Leaflet);

  // -- Lifecycle -------------------------------------------------------------

  /**
   * Initialize Leaflet map.
   * Executed right after DOM building completion.
   */
  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * Executed every time an `@Input` value changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map || !this.marker)
      return;

    if (changes['latitude'] || changes['longitude']) {
      // Always move the marker to reflect the new coordinates
      this.marker.setLatLng([this.latitude, this.longitude]);

      // If in view mode
      if (!this.isEditMode) {
        // Also pan the map and refresh the popup
        this.map.setView([this.latitude, this.longitude], 12);
        this.updatePopup();
      }
    }

    // Toggle draggability and preview icon, based on edit mode
    if (changes['isEditMode']) {
      if (this.isEditMode) {
        this.marker.setIcon(this.leafletService.previewIcon); // Switch to preview icon in edit mode
        this.marker.dragging?.enable(); // Enable drag
        this.marker.closePopup().unbindPopup(); // Remove static popup in edit mode
      } else {
        this.marker.setIcon(this.leafletService.defaultIcon); // Restore default icon in view mode
        this.marker.dragging?.disable(); // Disable drag
        this.updatePopup(); // Restore static popup in view mode
      }
    }
  }

  /**
   * Executed when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.map?.remove();
  }

  // -- Map management --------------------------------------------------------

  /**
   * Initialises Leaflet map.
   */
  private initMap(): void {
    const lat = this.latitude;
    const lng = this.longitude;

    // Guard: Skip if coordinates are not valid numbers
    if (Number.isNaN(lat) || Number.isNaN(lng))
      return;

    // Creates the L.Map and attaches the OSM tile layer
    this.map = this.leafletService.initMap('details-map', {
      scrollWheelZoom: false // Prevents scroll hijacking inside a scrollable page
    });
    this.map.setView([lat, lng], 14);

    // Build a marker at the received coordinates
    // In edit mode, builds a preview marker instead of the standard one
    this.marker = this.leafletService.createMarker(
      this.map,
      { latitude: lat, longitude: lng },
      this.isEditMode ? this.leafletService.previewIcon : this.leafletService.defaultIcon,
      this.isEditMode
    );

    // === Marker Listeners === //

    // When drag ends, update coordinates
    this.marker.on('dragend', () => {
      const position = this.marker!.getLatLng();
      this.coordinatesPicked.emit({ latitude: position.lat, longitude: position.lng });
    });

    // If in view mode
    if (!this.isEditMode) {
      // Also show the static popup
      this.updatePopup();
    }
  }

  /**
   * Builds and opens the static read-only popup on the current marker.
   */
  private updatePopup(): void {
    if (!this.marker)
      return;

    const popupHtml = this.address
      ? `<strong>${this.address}</strong><br><small>${this.latitude}, ${this.longitude}</small>`
      : `<small>${this.latitude}, ${this.longitude}</small>`;

    this.marker.bindPopup(popupHtml).openPopup();
  }

}