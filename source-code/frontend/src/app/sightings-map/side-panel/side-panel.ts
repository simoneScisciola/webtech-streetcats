import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-side-panel',
  imports: [],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
})
export class SidePanel implements OnChanges {
  @Input() isOpen = false;
  @Output() closePanel = new EventEmitter<void>();
  
  isAnimating = false;

  onAnimationEnd() {
    if (!this.isOpen) {
      this.isAnimating = false;
    }
  }

  ngOnChanges() {
    if (this.isOpen) {
      this.isAnimating = true;
    }
  }
}