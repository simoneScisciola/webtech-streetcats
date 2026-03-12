import { Component, Input, OnInit, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { Auth } from "#core/services/auth/auth"
import { Comment } from "#core/services/comment/comment"
import { ObservableToast } from '#core/services/observable-toast/observable-toast';
import { CommentPayload, CommentResponse, CommentViewModel } from '#shared/types/comment';
import { Sort } from '#shared/types/query-params';
import { initial } from '#shared/utils/text';

@Component({
  selector: 'app-sighting-comments',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './sighting-comments.html',
  styleUrl: './sighting-comments.scss',
})
export class SightingComments implements OnInit {

  /** ID of the parent sighting */
  @Input({ required: true }) sightingId!: number;

  // -- Dependency Injection --------------------------------------------------

  protected readonly authService = inject(Auth);
  private readonly commentService = inject(Comment);
  protected readonly observableToastService = inject(ObservableToast);

  // -- State and Signals -----------------------------------------------------

  /** List of comments */
  comments = signal<CommentResponse[]>([]);

  /** Defines comments retrieve state */
  loadingComments = signal(true);

  /** Defines comment post submit state */
  submitting = signal(false);

  /** Current selected sort */
  readonly currentSort = signal<Sort>({ field: 'createdAt', direction: 'desc' });

  // Comments icons
  icons = {
    post: faPaperPlane
  };

  // -- Form ------------------------------------------------------------------

  /** Reactive form */
  commentForm = new FormGroup({
    content: new FormControl('', [
      Validators.required
    ]),
  });

  /** Validation error messages */
  contentErrors = {
    required: 'Comment cannot be empty.'
  };

  /** Getters */
  get content() {
    return this.commentForm.controls.content;
  }

  // -- Computed signals ------------------------------------------------------

  /** UI-ready comments derived from raw API data. */
  readonly commentsVM = computed<CommentViewModel[]>(
    () => this.comments().map(comment => this.commentService.toCommentViewModel(comment))
  );

  // -- Utils -----------------------------------------------------------------

  protected readonly initial = initial;

  // -- Lifecycle -------------------------------------------------------------

  ngOnInit(): void {
    // Fetch all comments for this sighting
    this.commentService.getAll(this.currentSort(), { sightingId: this.sightingId })
      .subscribe({
        next: response => {
          this.comments.set(response.data);
          this.loadingComments.set(false);
        },
        error: () => this.loadingComments.set(false),
      });
  }

  // -- Methods ---------------------------------------------------------------

  /** True when the form can be submitted */
  get canSubmit(): boolean {
    return this.commentForm.valid && !this.submitting();
  }

  /**
   * Manages form submit
   */
  onSubmit(): void {
    if (this.canSubmit) {
      const username = this.authService.username();
      if (!username) {
        console.error('User not authenticated.');
        return;
      }

      this.submitting.set(true);

      // Build payload
      const { content } = this.commentForm.getRawValue();
      const payload: CommentPayload = {
        content: content!.trim(),
        username: this.authService.username() ?? "",
        sightingId: this.sightingId,
      };

      // Post comment
      this.observableToastService.trigger(
        this.commentService.create(payload),
        {
          loading: "Posting comment...",
          success: "Comment posted successfully.",
          error: "Comment post failed. Please, try again.",
          onSuccess: (res) => {
            console.log("Response:", res);

            // Prepend so the new comment appears at the top immediately
            this.comments.update(prev => [res, ...prev]);
            this.commentForm.reset(); // reset the whole form after a successful post
            this.submitting.set(false);
          },
          onError: (err) => {
            console.error('Comment post failed.', err);
            this.submitting.set(false);
          },
          onRetry: () => this.commentService.create(payload)
        }
      )
    } else {
      this.commentForm.markAllAsTouched();
    }
  }

}