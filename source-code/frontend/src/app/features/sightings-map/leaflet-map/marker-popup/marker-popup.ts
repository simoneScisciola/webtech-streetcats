import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-marker-popup',
  imports: [FontAwesomeModule],
  templateUrl: './marker-popup.html',
  styleUrl: './marker-popup.scss',
})
export class MarkerPopup {

  @Input() title = '';
  @Input() createdAt = '';

  @Output() detailsClick = new EventEmitter<void>();

  // Icons
  readonly icons = {
    details: faEye,
  };

  onDetailsClick(): void {
    this.detailsClick.emit();
  }

}