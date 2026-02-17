import { Component, Input, AfterViewInit, OnDestroy, effect } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  imports: [],
  templateUrl: './leaflet-map.html',
  styleUrl: './leaflet-map.scss',
})
export class LeafletMap implements AfterViewInit, OnDestroy {
  @Input() sidePanelOpen = false;
  
  private map?: L.Map;
  private resizeTimeout?: any;

  constructor() {
    // Effetto per ridimensionare la mappa quando il pannello si apre/chiude
    effect(() => {
      if (this.map) {
        this.resizeTimeout = setTimeout(() => {
          this.map?.invalidateSize();
        }, 350); // Aspetta che l'animazione finisca
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.map?.remove();
  }

  private initMap(): void {
    // Inizializza la mappa centrata su Roma
    this.map = L.map('map', {
      center: [41.9028, 12.4964],
      zoom: 13
    });

    // Aggiungi tile layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Esempio: aggiungi un marker
    L.marker([41.9028, 12.4964])
      .addTo(this.map)
      .bindPopup('Roma')
      .openPopup();
  }
}