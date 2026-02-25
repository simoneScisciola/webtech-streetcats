import { Component, Input, Output, EventEmitter, inject, signal, effect } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaw, faPlus, faRotateRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'ngx-sonner';

import { Sighting } from '#core/services/sighting/sighting';
import { ObservableToast } from '#core/services/observable-toast/observable-toast';
import { SightingsMapState } from '#features/sightings-map/sightings-map-state/sightings-map-state';
import { GeoCoords } from '#shared/types/coordinates';
import { SidePanel } from '#shared/components/side-panel/side-panel';
import { SidePanelHeader } from '#shared/components/side-panel/side-panel-header/side-panel-header';
import { SidePanelBody } from '#shared/components/side-panel/side-panel-body/side-panel-body';
import { SidePanelFooter } from '#shared/components/side-panel/side-panel-footer/side-panel-footer';
import { truncateText } from '#shared/utils/text';
import { Pagination } from '#shared/components/pagination/pagination';
import { Auth } from '#core/services/auth/auth';
import { SightingCard } from './sighting-card/sighting-card';
import { AddSightingForm } from './add-sighting-form/add-sighting-form';

@Component({
  selector: 'app-sightings-side-panel',
  imports: [FontAwesomeModule, SidePanel, SidePanelHeader, SidePanelBody, SightingCard, SidePanelFooter, AddSightingForm, Pagination],
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

  // Text formatting util
  protected readonly truncateText = truncateText;

  protected readonly sighting = inject(Sighting);
  private readonly sightingsMapState = inject(SightingsMapState);
  protected readonly auth = inject(Auth);
  private readonly observableToast = inject(ObservableToast);

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
    if (!this.auth.isAuthenticated()) {
      toast.error('You must be logged in to add a sighting.');
      return;
    }

    this.isAddingNewSighting.set(true);
  }

  onRefresh(): void {
    this.sighting.refresh();
  }

  onCancelAddSighting(): void {
    this.closeAddSightingForm();
  }

  onSightingCardClick(coords: GeoCoords): void {
    this.sightingsMapState.focusOnCoordinates(coords);
  }

  /**
   * Sends add-sighting request.
   * After a successful creation, navigates back to page 0.
   * @param payload FormData submitted by the form.
   */
  onAddSightingSubmit(payload: FormData) {
    this.observableToast.trigger(
      this.sighting.create(payload),
      {
        loading: "Adding sighting...",
        success: "Sighting added successfully.",
        error: "Failed to add sighting. Please, try again.",
        onSuccess: (res) => {
          console.log("Response:", res);

          this.closeAddSightingForm();
          this.closePanel.emit();

          this.sighting.goToPage(0);
        },
        onError: (err) => console.error('Add sighting failed.', err),
        onRetry: () => this.sighting.create(payload)
      }
    )
  }

  // -- Private helpers -------------------------------------------------------

  /** Resets add-sighting UI state and map picking mode */
  private closeAddSightingForm() {
    this.isAddingNewSighting.set(false);
    this.sightingsMapState.clearPreviewCoordinates();
    this.sightingsMapState.stopPicking();
  }

}