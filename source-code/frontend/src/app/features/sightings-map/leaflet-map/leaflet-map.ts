import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, inject, effect } from '@angular/core';
import * as L from 'leaflet';

import { Sighting } from '#core/services/sighting/sighting';
import { SightingResponse } from '#types/sighting';

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.html',
  styleUrl: './leaflet-map.scss',
})
export class LeafletMap implements AfterViewInit, OnDestroy, OnChanges {

  @Input() isPanelOpen = false;

  private readonly sighting = inject(Sighting);
  
  // Leaflet map instance
  private map?: L.Map;

  // Leaflet needs some time before resize notification
  private resizeTimeout?: any;

  // Map of sighting IDs -> Leaflet markers for efficient updates
  private markerMap = new Map<number, L.Marker>();
  
  constructor() {
    // Sync markers whenever `sightings` signal changes
    effect(() => {
      const sightings = this.sighting.sightings();
      if (this.map) {
        this.syncMarkers(sightings);
      }
    });
  }

  /**
   * Initialize Leaflet map.
   * Executed right after DOM building completion
   */
  ngAfterViewInit(): void {
    this.initMap();
    this.syncMarkers(this.sighting.sightings());
  }

  /**
   * 
   * Executed everytime a `@Input` value is changed
   */
  ngOnChanges(changes: SimpleChanges): void {
    // If `isPanelOpen` is changed and map is initalized
    if (changes['isPanelOpen'] && this.map) {
      console.log('isPanelOpen changed:', this.isPanelOpen);
      
      // Reset timeout
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      
      // Resize map after sidebar animation
      this.resizeTimeout = setTimeout(() => {
        console.log("Map resize.")
        this.map?.invalidateSize();
      }, 350); // Time in ms
    }
  }

  /**
   * Executed when component is destroyed
   */
  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.map?.remove();
  }

  /**
   * Initialize Leaflet map
   */
  private initMap(): void {

    // Initialize map and center it on Rome
    this.map = L.map('map', {
      center: [41.9028, 12.4964],
      zoom: 13
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

  }

  /**
   * Sync markers on map by deleting markers that are no longer in the sightings list and adding new ones.
   * @param sightings 
   * @returns 
   */
  private syncMarkers(sightings: SightingResponse[]): void {

    // If there's no map
    if (!this.map)
      return;

    // Convert incoming sightings to a set of IDs for easy lookup
    const incomingIds = new Set(sightings.map(s => s.id));

    // Delete markers that are no longer in the sightings list
    for (const [id, marker] of this.markerMap.entries()) {
      if (!incomingIds.has(id)) {
        marker.remove();
        this.markerMap.delete(id);
      }
    }

    // Add new markers
    for (const sighting of sightings) {
      if (!this.markerMap.has(sighting.id)) {
        const marker = L.marker([Number.parseFloat(sighting.latitude), Number.parseFloat(sighting.longitude)])
          .addTo(this.map)
          .bindPopup(`<strong>${sighting.title}</strong><br>${sighting.description ?? ''}`);

        this.markerMap.set(sighting.id, marker);
      }
    }

  }

}