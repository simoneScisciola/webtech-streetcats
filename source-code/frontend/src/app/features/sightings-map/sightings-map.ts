import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { Sighting } from '#core/services/sighting/sighting';
import { GeoCoords } from '#shared/types/coordinates';
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

  /** Keeps track of side panel open state. */
  isPanelOpen = signal(false);

  /** Side panel dimension. */
  sidePanelWidth = "400px";

  /** Keeps track of the user in "pick coordinate from map" mode, whether by the map picker or the context-menu popup. */
  isPickingCoordinates = signal(false);

  /** Pre-filled coordinates sent to the add-sighting form. */
  prefilledCoordinates = signal<GeoCoords | null>(null);

  private readonly sightingService = inject(Sighting);

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

  /**
   * Called by the form when the user wants to pick coordinates from the map.
   * Activates crosshair cursor on the map.
   */
  onStartPickingCoordinates(): void {
    this.isPickingCoordinates.set(true);
  }

  /**
   * Called when the user cancels coordinate picking.
   */
  onStopPickingCoordinates(): void {
    this.isPickingCoordinates.set(false);
  }

  /**
   * Opens the side panel and sets the pre-filled given coordinates.
   * Used both by map click (pick mode) and right-click context menu.
   * @param coords Latitude / longitude to pre-fill.
   */
  onCoordinatesSelected(coords: GeoCoords): void {
    this.isPickingCoordinates.set(false);
    this.prefilledCoordinates.set(coords);

    // Open panel if not already open
    if (!this.isPanelOpen())
      this.isPanelOpen.set(true);

    // Clear after one render so old coords don't persist on the next form open
    setTimeout(() => this.prefilledCoordinates.set(null), 0);
  }

}