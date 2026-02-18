import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-toggle-button',
  imports: [FontAwesomeModule],
  templateUrl: './toggle-button.html',
  styleUrl: './toggle-button.scss',
})
export class ToggleButton {

  @Input() isPanelOpen = false;
  @Output() toggleButtonClick = new EventEmitter<void>();
  
  // Font Awesome icons
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;

  onClick() {
    this.toggleButtonClick.emit();
  }

}