import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBinoculars, faPlus } from '@fortawesome/free-solid-svg-icons';

import { SidePanel } from '#shared/components/side-panel/side-panel';
import { SidePanelHeader } from '#shared/components/side-panel/side-panel-header/side-panel-header';
import { SidePanelBody } from '#shared/components/side-panel/side-panel-body/side-panel-body';
import { SidePanelFooter } from '#shared/components/side-panel/side-panel-footer/side-panel-footer';
import { SightingCard } from './sighting-card/sighting-card';
import { AddSightingForm } from './add-sighting-form/add-sighting-form';

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

  isAddingNewSighting = false;

  // Side Panel icons
  icons = {
    title: faBinoculars,
    addSighting: faPlus,
  };

  onClosePanel(): void {
    this.closePanel.emit();
  }

  onAddSighting(): void {
    this.isAddingNewSighting = true;
  }

  onCancelAddSighting(): void {
    this.isAddingNewSighting = false;
  }

}