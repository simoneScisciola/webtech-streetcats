import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBinoculars, faPlus } from '@fortawesome/free-solid-svg-icons';

import { SidePanel } from '#shared/components/side-panel/side-panel'
import { SidePanelHeader } from '#shared/components/side-panel/side-panel-header/side-panel-header'
import { SidePanelBody } from '#shared/components/side-panel/side-panel-body/side-panel-body';
import { SidePanelFooter } from '#shared/components/side-panel/side-panel-footer/side-panel-footer';
import { SightingCard } from './sighting-card/sighting-card';

@Component({
  selector: 'app-sightings-side-panel',
  imports: [FontAwesomeModule, SidePanel, SidePanelHeader, SidePanelBody, SightingCard, SidePanelFooter],
  templateUrl: './sightings-side-panel.html',
  styleUrl: './sightings-side-panel.scss',
})
export class SightingsSidePanel {

  @Input() isPanelOpen = false;
  @Input() width = "400px";
  @Output() closePanel = new EventEmitter<void>();
  
  // Side Panel icons
  icons = {
    title: faBinoculars,
    addSighting: faPlus
  };

  onClosePanel() {
    this.closePanel.emit();
  }

  // onAddSighting(payload: SightingFormValue): void {
  // this.sightingsService.create(payload).subscribe({
  //   next:  (sighting) => {
  //     console.log('Sighting creato:', sighting);
  //     this.togglePanel();
  //   },
  //   error: (err) => console.error('Errore creazione sighting', err),
  // });

}