import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaw, faPlus } from '@fortawesome/free-solid-svg-icons';

import { SidePanel } from '#shared/components/side-panel/side-panel';
import { SidePanelHeader } from '#shared/components/side-panel/side-panel-header/side-panel-header';
import { SidePanelBody } from '#shared/components/side-panel/side-panel-body/side-panel-body';
import { SidePanelFooter } from '#shared/components/side-panel/side-panel-footer/side-panel-footer';
import { SightingCard } from './sighting-card/sighting-card';
import { AddSightingForm } from './add-sighting-form/add-sighting-form';
import { SightingPayload } from '#types/sighting';
import { Sighting } from '#core/services/sighting/sighting';

@Component({
  selector: 'app-sightings-side-panel',
  imports: [FontAwesomeModule, SidePanel, SidePanelHeader, SidePanelBody, SightingCard, SidePanelFooter, AddSightingForm],
  templateUrl: './sightings-side-panel.html',
  styleUrl: './sightings-side-panel.scss',
})
export class SightingsSidePanel {

  @Input() isPanelOpen = false;
  @Input() width = '400px';
  @Output() closePanel = new EventEmitter<void>();

  private readonly sighting = inject(Sighting);

  isAddingNewSighting = false;

  // Side Panel icons
  icons = {
    title: faPaw,
    addSighting: faPlus,
  };

  onClosePanel(): void {
    this.closePanel.emit();
  }

  onAddSightingClick(): void {
    this.isAddingNewSighting = true;
  }

  onCancelAddSighting(): void {
    this.isAddingNewSighting = false;
  }

  /**
   * Sends login request
   * @param payload submitted credetials
   */
  onAddSightingSubmit(payload: FormData) {
    this.sighting.create(payload).subscribe({
      next: (res) => {
        console.log("Response:", res);
      },
      error: (err) => console.error('Add sighting failed.', err),
    });
  }

}