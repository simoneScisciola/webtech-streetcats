
import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Comment } from "#core/services/comment/comment"
import { CommentPayload, CommentResponse, CommentViewModel } from '#shared/types/comment';
import { Sort } from '#shared/types/query-params';

/**
 * SightingCommentsComponent
 *
 * Self-contained comment section:
 *  - fetches all comments for the sighting on init
 *  - provides a form to post a new comment
 *  - prepends new comments to the list without a full reload
 */

@Component({
  selector: 'app-sighting-comments',
  imports: [FormsModule],
  templateUrl: './sighting-comments.html',
  styleUrl: './sighting-comments.scss',
})
export class SightingComments implements OnInit {

  /** ID of the parent sighting; required so the component is self-sufficient */
  @Input({ required: true }) sightingId!: number;

  private readonly commentService = inject(Comment);

  
  comments        = signal<CommentResponse[]>([]);
  loadingComments = signal(true);
  submitting      = signal(false);
  readonly currentSort = signal<Sort>({ field: 'createdAt', direction: 'desc' });

  /** UI-ready comments derived from raw API data. */
  readonly commentsVM = computed<CommentViewModel[]>(
    () => this.comments().map(comment => this.commentService.toCommentViewModel(comment))
  );

  // Two-way bound form fields
  username = '';
  content  = '';

  ngOnInit(): void {
    // Fetch all comments for this sighting as soon as the component is ready
    this.commentService.getAll(this.currentSort(), { sightingId: this.sightingId }).subscribe({
      next: response => {
        this.comments.set(response.data);
        this.loadingComments.set(false);
      },
      error: () => this.loadingComments.set(false),
    });
  }

  /** True when the form can be submitted */
  get canSubmit(): boolean {
    return this.content.trim().length > 0
        && this.username.trim().length > 0
        && !this.submitting();
  }

  /** Posts the new comment and prepends the result to the list on success */
  submit(): void {
    if (!this.canSubmit) return;

    const payload: CommentPayload = {
      content:    this.content.trim(),
      username:   this.username.trim(),
      sightingId: this.sightingId,
    };

    this.submitting.set(true);

    this.commentService.create(payload).subscribe({
      next: created => {
        // Prepend so the new comment appears at the top immediately
        this.comments.update(prev => [created, ...prev]);
        this.content = ''; // Reset only the message field; keep the username for convenience
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }

  /** First letter of a username – used for the avatar placeholder */
  initial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

}