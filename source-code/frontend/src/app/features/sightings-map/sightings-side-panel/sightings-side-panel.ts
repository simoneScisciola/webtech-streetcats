import { Component, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaw, faPlus, faRotateRight, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Sighting } from '#core/services/sighting/sighting';
import { ObservableToast } from '#core/services/observable-toast/observable-toast';
import { SightingsMapState } from '#features/sightings-map/sightings-map-state/sightings-map-state';
import { SidePanel } from '#shared/components/side-panel/side-panel';
import { SidePanelHeader } from '#shared/components/side-panel/side-panel-header/side-panel-header';
import { SidePanelBody } from '#shared/components/side-panel/side-panel-body/side-panel-body';
import { SidePanelFooter } from '#shared/components/side-panel/side-panel-footer/side-panel-footer';
import { SightingCard } from './sighting-card/sighting-card';
import { AddSightingForm } from './add-sighting-form/add-sighting-form';

@Component({
  selector: 'app-sightings-side-panel',
  imports: [FontAwesomeModule, SidePanel, SidePanelHeader, SidePanelBody, SightingCard, SidePanelFooter, AddSightingForm],
  providers: [ObservableToast],
  templateUrl: './sightings-side-panel.html',
  styleUrl: './sightings-side-panel.scss',
})
export class SightingsSidePanel {

  /** Tracks side panel open state */
  @Input() isPanelOpen = false;

  /** Side panel fixed width */
  @Input() width = '400px';

  /** Emitted when the side panel has been closed */
  @Output() closePanel = new EventEmitter<void>();

  /** Tracks if add sighting form should be shown */
  isAddingNewSighting = signal(false);

  protected readonly sighting = inject(Sighting);
  private readonly sightingsMapState = inject(SightingsMapState);
  private readonly toast = inject(ObservableToast);

  // Side Panel icons
  icons = {
    title: faPaw,
    addSighting: faPlus,
    refresh: faRotateRight,
    loading: faSpinner,
  };

  constructor() {
    // Opens add-sighting form whenever `previewCoordinates` signal changes
    effect(() => {
      const coords = this.sightingsMapState.previewCoordinates();
      if (coords) {
        this.isAddingNewSighting.set(true);
      }
    });
  }

  onClosePanel(): void {
    this.closeAddSightingForm();
    this.closePanel.emit();
  }

  onAddSightingClick(): void {
    this.isAddingNewSighting.set(true);
  }

  onRefresh(): void {
    this.sighting.refresh();
  }

  onCancelAddSighting(): void {
    this.closeAddSightingForm();
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

          this.closeAddSightingForm();
          this.closePanel.emit();
          this.sighting.refresh();
        },
        onError: (err) => console.error('Add sighting failed.', err),
        onRetry: () => this.sighting.create(payload)
      }
    )
  }

  // Update sightings panel state
  private closeAddSightingForm() {
    this.isAddingNewSighting.set(false);
    this.sightingsMapState.clearPreviewCoordinates();
    this.sightingsMapState.stopPicking();
  }

}