import { Component, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBinoculars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-panel-header',
  imports: [FontAwesomeModule],
  templateUrl: './side-panel-header.html',
  styleUrl: './side-panel-header.scss',
})
export class SidePanelHeader {

  @Output() closeButtonClick = new EventEmitter<void>();

  // Font Awesome icons
  faBinoculars = faBinoculars;

  onClose() {
    this.closeButtonClick.emit();
  }

}
