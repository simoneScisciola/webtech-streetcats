import { Component, Output, EventEmitter } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBinoculars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-panel-header',
  imports: [FontAwesomeModule],
  templateUrl: './panel-header.html',
  styleUrl: './panel-header.scss',
})
export class PanelHeader {

  @Output() closeButtonClick = new EventEmitter<void>();

  // Font Awesome icons
  faBinoculars = faBinoculars;

  onClose() {
    this.closeButtonClick.emit();
  }

}
