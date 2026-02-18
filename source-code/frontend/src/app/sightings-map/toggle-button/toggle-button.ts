import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark, faList } from '@fortawesome/free-solid-svg-icons'

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
  faXmark = faXmark;
  faList = faList;

  onClick() {
    this.toggleButtonClick.emit();
  }

}