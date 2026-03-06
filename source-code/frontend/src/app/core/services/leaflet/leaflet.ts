
import { Injectable, ApplicationRef, EnvironmentInjector, ComponentRef, Type, createComponent, inject } from '@angular/core';
import * as L from 'leaflet';

/**
 * Shared service for all Leaflet-based components.
 */
@Injectable({
  providedIn: 'root',
})
export class Leaflet {

  // -- State and Signals -----------------------------------------------------

  /** Default Leaflet marker icon. */
  readonly defaultIcon = L.icon({
    iconUrl: 'assets/leaflet/marker-icon.png',
    iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  /** Icon used when a marker is focused. */
  readonly focusedIcon = L.icon({
    iconUrl: 'assets/leaflet/focus-marker-icon.png',
    iconRetinaUrl: 'assets/leaflet/focus-marker-icon-2x.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  /** Icon used for a draggable marker in the preview mode. */
  readonly previewIcon = L.icon({
    iconUrl: 'assets/leaflet/preview-marker-icon.png',
    iconRetinaUrl: 'assets/leaflet/preview-marker-icon-2x.png',
    shadowUrl: 'assets/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // -- Dependency Injection --------------------------------------------------
  
  private readonly appRef = inject(ApplicationRef);
  private readonly envInjector = inject(EnvironmentInjector);

  // -- Map management --------------------------------------------------------

  /**
   * Creates a Leaflet map on the given native element and attaches the standard OpenStreetMap tile layer to it.
   *
   * @param element The native DOM element (or element ID) that hosts the map.
   * @param options Any extra Leaflet MapOptions to forward.
   * @returns The ready-to-use L.Map instance.
   */
  initMap(element: HTMLElement | string, options?: L.MapOptions): L.Map {

    // Initialise map
    const map = L.map(element, options);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    return map;

  }

  // -- Popup management ------------------------------------------------------

  /**
   * Factory that creates a dynamic Angular component, mounts it into the ApplicationRef, wraps it in a Leaflet popup, and registers a cleanup callback for when the popup is removed.
   * Note: positioning (setLatLng / bindPopup) is left to the caller, because map-level popups and marker popups anchor differently.
   * @param ComponentClass The Angular component class to instantiate.
   * @param configureInputOutput Optional callback to set inputs / subscribe to outputs on the new ComponentRef.
   * @param onRemove Optional callback invoked when Leaflet removes the popup.
   * @returns The Leaflet popup and the Angular ComponentRef.
   */
  createAngularPopup<T>(ComponentClass: Type<T>, configureInputOutput?: (ref: ComponentRef<T>) => void, onRemove?: (ref: ComponentRef<T>) => void): { popup: L.Popup; componentRef: ComponentRef<T> } {

    // Instantiate the Angular component (it'll be outside the normal component tree)
    const componentRef = createComponent(ComponentClass, {
      environmentInjector: this.envInjector,
    });

    // Allow the caller to set inputs and subscribe to outputs
    configureInputOutput?.(componentRef);

    // Attach to ApplicationRef so Angular runs change detection on it
    this.appRef.attachView(componentRef.hostView);

    // Force initial rendering so the DOM element is ready before Leaflet reads it
    componentRef.changeDetectorRef.detectChanges();

    // Use the component's rendered DOM element as the Leaflet popup content
    const popup = L.popup({ closeButton: true })
      .setContent(componentRef.location.nativeElement);

    // On popup removal: destroy the Angular component, then run caller's callback
    popup.on('remove', () => {
      this.destroyComponent(componentRef);
      onRemove?.(componentRef);
    });

    return { popup, componentRef };

  }

  /**
   * Detaches and destroys a dynamic component in order to prevent memory leaks.
   * Safe to call when `componentRef` is undefined.
   * @param componentRef The ComponentRef to destroy, or undefined.
   */
  destroyComponent(componentRef?: ComponentRef<any>): void {
    if (componentRef) {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
    }
  }

}