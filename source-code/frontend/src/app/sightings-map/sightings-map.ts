import { Component, signal } from '@angular/core';

import { LeafletMap } from './leaflet-map/leaflet-map';
import { SidePanel } from './side-panel/side-panel';
import { ToggleButton } from './toggle-button/toggle-button';

@Component({
  selector: 'app-sightings-map',
  imports: [LeafletMap, ToggleButton, SidePanel],
  templateUrl: './sightings-map.html',
  styleUrl: './sightings-map.scss',
})
export class SightingsMap {

  isPanelOpen = signal(false);

  toggleSidePanel() {
    console.log("Toggle Side Panel");
    this.isPanelOpen.update(value => !value);
  }

}