import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.html',
  styleUrl: './leaflet-map.scss',
})
export class LeafletMap implements AfterViewInit, OnDestroy, OnChanges {

  @Input() isPanelOpen = false;
  
  // Leaflet map instance
  private map?: L.Map;

  // Leaflet needs some time before resize notification
  private resizeTimeout?: any;

  /**
   * Initialize Leaflet map.
   * Executed right after DOM building completion
   */
  ngAfterViewInit(): void {
    this.initMap();
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

    // Example: Add marker
    L.marker([41.9028, 12.4964])
      .addTo(this.map)
      .bindPopup('Roma')
      .openPopup();
  }

}