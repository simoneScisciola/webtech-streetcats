import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { Sighting } from '#core/services/sighting/sighting';
import { LeafletMap } from './leaflet-map/leaflet-map';
import { SightingsSidePanel } from './sightings-side-panel/sightings-side-panel';
import { ToggleButton } from './toggle-button/toggle-button';
import { SightingsMapState } from './sightings-map-state/sightings-map-state';

@Component({
  selector: 'app-sightings-map',
  imports: [LeafletMap, ToggleButton, SightingsSidePanel],
  providers: [SightingsMapState],
  templateUrl: './sightings-map.html',
  styleUrl: './sightings-map.scss',
})
export class SightingsMap implements OnInit, OnDestroy {

  /** Keeps track of side panel open state. */
  isPanelOpen = signal(false);

  /** Side panel dimension. */
  sidePanelWidth = "400px";

  private readonly sightingService = inject(Sighting);
  private readonly sightingsMapState = inject(SightingsMapState);

  // -- Lifecycle -------------------------------------------------------------

  ngOnInit(): void {
    this.sightingService.startPolling();
  }

  ngOnDestroy(): void {
    this.sightingService.stopPolling();
  }

  // -- Methods ---------------------------------------------------------------

  /**
   * Called when the toggle button is clicked.
   * Shows or hides side panel.
   */
  togglePanel() {
    console.log("Toggle Side Panel");
    this.isPanelOpen.update(value => !value);
  }

  /**
   * Called when the side panel is closed.
   * Hides the panel and removes the preview marker.
   */
  onClosePanel(): void {
    this.isPanelOpen.set(false);
  }

  /**
   * Opens the side panel and leaves "pick coordinates" mode.
   * Used both by map click (pick mode) and right-click context menu.
   * @param coords Latitude / longitude to pre-fill.
   */
  onCoordinatesSelected(): void {
    this.sightingsMapState.stopPicking();

    // Open panel if not already open
    if (!this.isPanelOpen())
      this.isPanelOpen.set(true);
  }

}