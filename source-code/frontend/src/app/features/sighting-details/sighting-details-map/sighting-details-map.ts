import { Component, Input, AfterViewInit, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';
import * as L from 'leaflet';

import { Leaflet } from '#core/services/leaflet/leaflet';

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

  // -- State and Signals -----------------------------------------------------

  /** Leaflet map instance */
  private map?: L.Map;

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
    // Re-render only if coordinates actually changed and the map already exists
    if (this.map && (changes['latitude'] || changes['longitude'])) {
      this.initMap();
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

    // Destroy the previous instance before creating a new one
    this.map?.remove();

    // Creates the L.Map and attaches the OSM tile layer
    this.map = this.leafletService.initMap('details-map', {
      scrollWheelZoom: false // Prevents scroll hijacking inside a scrollable page
    });
    this.map.setView([lat, lng], 14);

    // Popup
    const popupHtml = this.address
      ? `<strong>${this.address}</strong><br><small>${this.latitude}, ${this.longitude}</small>`
      : `<small>${this.latitude}, ${this.longitude}</small>`;

    // Add marker
    L.marker(
      [lat, lng],
      { icon: this.leafletService.defaultIcon }
    )
      .addTo(this.map)
      .bindPopup(popupHtml)
      .openPopup();
  }

}