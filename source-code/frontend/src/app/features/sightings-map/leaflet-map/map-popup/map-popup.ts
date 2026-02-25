import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-map-popup',
  imports: [FontAwesomeModule],
  templateUrl: './map-popup.html',
  styleUrl: './map-popup.scss',
})
export class MapPopup {

  @Input() isAuthenticated = false;

  @Output() addSightingClick = new EventEmitter<void>();

  // Icons
  readonly icons = {
    add: faPlus
  };

  onAddSightingClick(): void {
    this.addSightingClick.emit();
  }

}