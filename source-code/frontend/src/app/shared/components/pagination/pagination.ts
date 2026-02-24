import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {

  /** Currently active page (0-based) */
  @Input() currentPage = 0;

  /** Total number of pages */
  @Input() totalPages = 0;

  /** Emitted with the new 0-based page index when the user clicks a page button */
  @Output() pageChange = new EventEmitter<number>();

  /**
   * Builds the array of page indices to display.
   * Shows at most 5 pages centered around the current page.
   */
  get visiblePages(): number[] {
    const total = this.totalPages;
    if (total <= 0)
      return [];

    // Window size: show up to 5 page buttons
    const windowSize = 5;
    const half = Math.floor(windowSize / 2);

    let start = Math.max(0, this.currentPage - half);
    let end = Math.min(total - 1, start + windowSize - 1);

    // Shift the window left if it hits the right boundary
    start = Math.max(0, end - windowSize + 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  
  }

  /** Navigate to a page, ignoring out-of-range clicks */
  goTo(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.currentPage)
      return;

    this.pageChange.emit(page);
  }

}