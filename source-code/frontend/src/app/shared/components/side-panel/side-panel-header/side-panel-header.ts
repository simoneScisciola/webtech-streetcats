import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-panel-header',
  imports: [FontAwesomeModule],
  templateUrl: './side-panel-header.html',
  styleUrl: './side-panel-header.scss',
})
export class SidePanelHeader {

  @Input({ required: true }) title = '';
  @Input() icon: IconDefinition | null = null;
  @Output() closeButtonClick = new EventEmitter<void>();

  onClose() {
    this.closeButtonClick.emit();
  }

}
