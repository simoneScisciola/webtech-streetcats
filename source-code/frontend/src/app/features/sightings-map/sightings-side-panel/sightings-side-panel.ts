import { Component, Input, Output, EventEmitter, inject, signal, OnChanges, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaw, faPlus, faRotateRight, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Sighting } from '#core/services/sighting/sighting';
import { ObservableToast } from '#core/services/observable-toast/observable-toast';
import { SidePanel } from '#shared/components/side-panel/side-panel';
import { SidePanelHeader } from '#shared/components/side-panel/side-panel-header/side-panel-header';
import { SidePanelBody } from '#shared/components/side-panel/side-panel-body/side-panel-body';
import { SidePanelFooter } from '#shared/components/side-panel/side-panel-footer/side-panel-footer';
import { GeoCoords } from '#shared/types/coordinates';
import { SightingCard } from './sighting-card/sighting-card';
import { AddSightingForm } from './add-sighting-form/add-sighting-form';

@Component({
  selector: 'app-sightings-side-panel',
  imports: [FontAwesomeModule, SidePanel, SidePanelHeader, SidePanelBody, SightingCard, SidePanelFooter, AddSightingForm],
  providers: [ObservableToast],
  templateUrl: './sightings-side-panel.html',
  styleUrl: './sightings-side-panel.scss',
})
export class SightingsSidePanel implements OnChanges {

  /** Tracks side panel open state */
  @Input() isPanelOpen = false;

  /** Side panel fixed width */
  @Input() width = '400px';

  /** Forwarded to the add sighting form to show a "waiting for map click" banner. */
  @Input() isPickingCoordinates = false;

  /** Coordinates received from the map; forwarded directly to the form. */
  @Input() prefilledCoordinates: GeoCoords | null = null;

  /** Emitted when the side panel has been closed */
  @Output() closePanel = new EventEmitter<void>();

  /** Bubbled up from AddSightingForm; activates pick mode in the map. */
  @Output() startPickingCoordinates = new EventEmitter<void>();

  /** Bubbled up from AddSightingForm; deactivates pick mode in the map. */
  @Output() stopPickingCoordinates = new EventEmitter<void>();

  /** Tracks if add sighting form should be shown */
  isAddingNewSighting = signal(false);

  readonly sighting = inject(Sighting);
  protected readonly toast = inject(ObservableToast);

  // Side Panel icons
  icons = {
    title: faPaw,
    addSighting: faPlus,
    refresh: faRotateRight,
    loading: faSpinner,
  };

  /**
   * Executed every time an `@Input` value changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    // When coordinates are provided from the map, open the add-sighting form automatically
    if (changes['prefilledCoordinates']?.currentValue) {
      this.isAddingNewSighting.set(true);
    }
  }

  onClosePanel(): void {
    this.closePanel.emit();
  }

  onAddSightingClick(): void {
    this.isAddingNewSighting.set(true);
  }

  onCancelAddSighting(): void {
    this.isAddingNewSighting.set(false);
    this.stopPickingCoordinates.emit(); // Ensure pick mode is exited if the user cancels the form entirely
  }

  onRefresh(): void {
    this.sighting.refresh();
  }

  /** Bubbles the pick-start event from the form. */
  onStartPickingCoordinates(): void {
    this.startPickingCoordinates.emit();
  }

  /** Bubbles the pick-cancel event from the form. */
  onStopPickingCoordinates(): void {
    this.stopPickingCoordinates.emit();
  }

  /**
   * Sends add-sighting request.
   * @param payload FormData submitted by the form.
   */
  onAddSightingSubmit(payload: FormData) {
    this.toast.trigger(
      this.sighting.create(payload),
      {
        loading: "Adding sighting...",
        success: "Sighting added successfully.",
        error: "Failed to add sighting. Please, try again.",
        onSuccess: (res) => {
          console.log("Response:", res);

          // Update sightings panel state
          this.isAddingNewSighting.set(false);
          this.closePanel.emit();
          this.sighting.refresh();
        },
        onError: (err) => console.error('Add sighting failed.', err),
        onRetry: () => this.sighting.create(payload)
      }
    )
  }

}