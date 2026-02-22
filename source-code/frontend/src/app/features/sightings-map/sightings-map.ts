import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { Sighting } from '#core/services/sighting/sighting';
import { LeafletMap } from './leaflet-map/leaflet-map';
import { SightingsSidePanel } from './sightings-side-panel/sightings-side-panel';
import { ToggleButton } from './toggle-button/toggle-button';

@Component({
  selector: 'app-sightings-map',
  imports: [LeafletMap, ToggleButton, SightingsSidePanel],
  templateUrl: './sightings-map.html',
  styleUrl: './sightings-map.scss',
})
export class SightingsMap implements OnInit, OnDestroy {

  private readonly sightingService = inject(Sighting);

  // Manages side panel opening
  isPanelOpen = signal(false);

  // Side panel dimension
  sidePanelWidth = "400px";

  ngOnInit(): void {
    this.sightingService.startPolling();
  }

  ngOnDestroy(): void {
    this.sightingService.stopPolling();
  }

  /**
   * Shows or hides side panel.
   */
  togglePanel() {
    console.log("Toggle Side Panel");
    this.isPanelOpen.update(value => !value);
  }

}