import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBinoculars, faMapMarkerAlt, faClock, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

import { PanelHeader } from './panel-header/panel-header';
import { SightingCard } from './sighting-card/sighting-card';
import { PanelFooter } from './panel-footer/panel-footer';

@Component({
  selector: 'app-side-panel',
  imports: [FontAwesomeModule, PanelHeader, SightingCard, PanelFooter],
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