import { Component, signal } from '@angular/core';

import { LeafletMap } from './leaflet-map/leaflet-map';
import { SightingsSidePanel } from './sightings-side-panel/sightings-side-panel';
import { ToggleButton } from './toggle-button/toggle-button';

@Component({
  selector: 'app-sightings-map',
  imports: [LeafletMap, ToggleButton, SightingsSidePanel],
  templateUrl: './sightings-map.html',
  styleUrl: './sightings-map.scss',
})
export class SightingsMap {

  // Manages side panel opening
  isPanelOpen = signal(false);

  // Side panel dimension
  sidePanelWidth = "400px";

  /**
   * Shows or hides side panel.
   */
  togglePanel() {
    console.log("Toggle Side Panel");
    this.isPanelOpen.update(value => !value);
  }

}