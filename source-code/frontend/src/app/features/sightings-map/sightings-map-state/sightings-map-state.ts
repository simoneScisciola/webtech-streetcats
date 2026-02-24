import { Injectable, signal } from '@angular/core';

import { GeoCoords } from '#shared/types/coordinates';

/**
 * Local UI state for the SightingsMap feature.
 * Provided at component level — created and destroyed with SightingsMap.
 */
@Injectable()
export class SightingsMapState {

  // State

  /**
   * Coordinates currently shown as a temporary preview marker on the map and used to pre-fill the add-sighting form.
   * Null when no preview is active.
   */
  private readonly _previewCoordinates = signal<GeoCoords | null>(null);

  /** 
   * Keeps track of the user in "pick coordinate from map" mode. 
   * When true, the map click saves point coordinates instead of being ignored.
  */
  private readonly _isPickingCoordinates = signal(false);
  
  // Readonly derived state
  readonly previewCoordinates = this._previewCoordinates.asReadonly();
  readonly isPickingCoordinates = this._isPickingCoordinates.asReadonly();


  // Methods

  /**
   * Called by the form when the user wants to pick coordinates from the map.
   * Activates crosshair cursor on the map.
   */
  startPicking() {
    this._isPickingCoordinates.set(true);
  }

  /**
   * Called when the user cancels coordinate picking.
   */
  stopPicking() {
    this._isPickingCoordinates.set(false);
  }

  /**
   * Sets the preview coordinates in the state.
   * @param coords The coordinates to set as preview, or null to clear the preview.
   * @param source The source of the coordinates
   */
  setPreviewCoordinates(coords: GeoCoords | null, source: 'map' | 'form') {
    this._previewCoordinates.set(coords);
  }

  /**
   * Clears the preview coordinates, removing any temporary marker from the map and clearing the form pre-fill.
   */
  clearPreviewCoordinates() {
    this._previewCoordinates.set(null);
  }

}