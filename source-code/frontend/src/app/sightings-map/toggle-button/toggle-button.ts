import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  imports: [],
  templateUrl: './toggle-button.html',
  styleUrl: './toggle-button.scss',
})
export class ToggleButton {
  @Input() isOpen = false;
  @Output() buttonClick = new EventEmitter<void>();
}