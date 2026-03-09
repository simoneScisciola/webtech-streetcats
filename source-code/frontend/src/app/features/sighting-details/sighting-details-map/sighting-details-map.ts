import { Component, Input, AfterViewInit, OnChanges, OnDestroy, ViewChild, ElementRef, SimpleChanges, inject } from '@angular/core';
import * as L from 'leaflet';

import { Leaflet } from '#core/services/leaflet/leaflet';

/**
 * SightingMapComponent
 *
 * Shows a single non-interactive marker on a Leaflet map.
 * All boilerplate (map init, tile layer, icon definitions) is
 * delegated to LeafletService, keeping this component minimal.
 */
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

  @ViewChild('mapEl') mapElRef!: ElementRef<HTMLDivElement>;

  private readonly leaflet = inject(Leaflet);

  private map: L.Map | null = null;

  ngAfterViewInit(): void {
    // Initialise the map once the view DOM is ready
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-render only if coordinates actually changed and the map already exists
    if (this.map && (changes['latitude'] || changes['longitude'])) {
      this.initMap();
    }
  }

  ngOnDestroy(): void {
    // Remove the Leaflet instance to prevent memory leaks
    this.map?.remove();
    this.map = null;
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private initMap(): void {
    const lat = this.latitude;
    const lng = this.longitude;

    // Guard: skip if coordinates are not valid numbers
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    // Destroy the previous instance before creating a new one
    this.map?.remove();

    // LeafletService creates the L.Map and attaches the OSM tile layer
    this.map = this.leaflet.initMap(this.mapElRef.nativeElement, {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false, // Prevents scroll hijacking inside a scrollable page
    });

    // Popup: address in bold (when available) + coordinates in small text
    const popupHtml = this.address
      ? `<strong>${this.address}</strong><br><small>${this.latitude}, ${this.longitude}</small>`
      : `<small>${this.latitude}, ${this.longitude}</small>`;

    // Reuse the shared defaultIcon from LeafletService (same asset as LeafletMap)
    L.marker([lat, lng], { icon: this.leaflet.defaultIcon })
      .addTo(this.map)
      .bindPopup(popupHtml)
      .openPopup();
  }

}