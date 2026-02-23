import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaw, faPlus, faRotateRight, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Sighting } from '#core/services/sighting/sighting';
import { ObservableToast } from '#core/services/observable-toast/observable-toast';
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

  @Input() isPanelOpen = false;
  @Input() width = '400px';
  @Output() closePanel = new EventEmitter<void>();

  readonly sighting = inject(Sighting);
  protected readonly toast = inject(ObservableToast);

  isAddingNewSighting = signal(false);

  // Side Panel icons
  icons = {
    title: faPaw,
    addSighting: faPlus,
    refresh: faRotateRight,
    loading: faSpinner,
  };

  onClosePanel(): void {
    this.closePanel.emit();
  }

  onAddSightingClick(): void {
    this.isAddingNewSighting.set(true);
  }

  onCancelAddSighting(): void {
    this.isAddingNewSighting.set(false);
  }

  onRefresh(): void {
    this.sighting.refresh();
  }

  /**
   * Sends login request
   * @param payload submitted credetials
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