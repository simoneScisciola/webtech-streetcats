import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBinoculars, faMapMarkerAlt, faClock, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

import { SidePanelHeader } from './side-panel-header/side-panel-header';
import { SidePanelBody } from './side-panel-body/side-panel-body';
import { SidePanelFooter } from './side-panel-footer/side-panel-footer';
import { SightingCard } from './sighting-card/sighting-card';

@Component({
  selector: 'app-side-panel',
  imports: [FontAwesomeModule, SidePanelHeader, SidePanelBody, SightingCard, SidePanelFooter],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
})
export class SidePanel {

  @Input() isPanelOpen = false;
  @Input() width = "400px";
  @Output() closePanel = new EventEmitter<void>();
  
  // Font Awesome icons
  faBinoculars = faBinoculars;
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faPlus = faPlus;
  faEye = faEye;

  onClosePanel() {
    this.closePanel.emit();
  }

}