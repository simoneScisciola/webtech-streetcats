import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBinoculars, faMapMarkerAlt, faClock, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-panel',
  imports: [FontAwesomeModule],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
})
export class SidePanel {

  @Input() isPanelOpen = false;
  @Input() width = "400px";
  @Output() closeButtonClick = new EventEmitter<void>();
  
  // Font Awesome icons
  faBinoculars = faBinoculars;
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;
  faPlus = faPlus;
  faEye = faEye;

  onClose() {
    this.closeButtonClick.emit();
  }

}