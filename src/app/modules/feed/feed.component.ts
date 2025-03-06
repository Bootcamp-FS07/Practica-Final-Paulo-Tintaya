import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../shared/models/post.model';
import { PostService } from '../../core/services/post/post.service';
import { CommentService } from '../../core/services/comment/comment.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { Comment } from '../../shared/models/comment.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TimeAgoPipe
  ],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  currentPage = 1;
  postsPerPage = 5;
  newPostText = '';
  editingPostId: string | null = null;
  editPostText: string = '';
  loading = false;

  commentsMap: { [postId: string]: Comment[] } = {};
  newCommentText: { [postId: string]: string } = {};
  editingCommentId: string | null = null;
  editCommentText: string = '';

  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        posts.forEach((post) => this.loadComments(post._id));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.snackBar.open('Failed to load psots :c', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  addPost(): void {
    if (!this.newPostText.trim()) return;
    this.loading = true;
    this.postService.addPost(this.newPostText).subscribe({
      next: () => {
        this.newPostText = '';
        this.loadPosts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error adding post:', err);
        this.snackBar.open('Failed to add post', 'Close', { duration: 3000 });
        this.loading = false;
      },
    });
  }

  updatePost(postId: string): void {
    if (!this.editPostText.trim()) return;
    this.loading = true;
    this.postService.updatePost(postId, this.editPostText).subscribe({
      next: () => {
        this.cancelEditing();
        this.loadPosts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating post:', err);
        this.snackBar.open('Failed to update post', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  deletePost(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe({
        next: () => this.loadPosts(),
        error: (err) => {
          console.error('Error deleting post:', err);
        },
      });
    }
  }

  loadComments(postId: string): void {
    this.commentService.getComments(postId).subscribe({
      next: (comments) => {
        this.commentsMap[postId] = comments;
      },
      error: (err) => {
        console.error(`Error fetching comments for post ${postId}:`, err);
      },
    });
  }

  addComment(postId: string): void {
    const text = this.newCommentText[postId];
    if (!text || !text.trim()) return;
    this.commentService.addComment(text, postId).subscribe({
      next: () => {
        this.newCommentText[postId] = '';
        this.loadComments(postId);
      },
      error: (err) => {
        console.error(`Error adding comment to post ${postId}:`, err);
      },
    });
  }

  startEditingComment(comment: Comment): void {
    const currentUserId = this.currentUserId;
    if (comment.author._id === currentUserId) {
      this.editingCommentId = comment._id;
      this.editCommentText = comment.text;
    }
  }

  cancelEditingComment(): void {
    this.editingCommentId = null;
    this.editCommentText = '';
  }

  saveEditedComment(commentId: string, postId: string): void {
    if (!this.editCommentText.trim()) return;
    this.commentService
      .updateComment(commentId, this.editCommentText, postId)
      .subscribe({
        next: () => {
          this.cancelEditingComment();
          this.loadComments(postId);
        },
        error: (err) => {
          console.error('Error editing comment:', err);
        },
      });
  }

  deleteComment(commentId: string, postId: string): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(commentId).subscribe({
        next: () => this.loadComments(postId),
        error: (err) => {
          console.error('Error deleting comment:', err);
        },
      });
    }
  }

  getCommentAuthorId(comment: Comment): string {
    return comment.author._id;
  }

  getAuthorId(post: Post): string {
    return typeof post.author === 'string' ? post.author : post.author._id;
  }

  get currentUserId(): string | null {
    return localStorage.getItem('userId');
  }

  startEditing(post: Post): void {
    if (this.getAuthorId(post) === this.currentUserId) {
      this.editingPostId = post._id;
      this.editPostText = post.text;
    }
  }

  cancelEditing(): void {
    this.editingPostId = null;
    this.editPostText = '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get currentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  get paginatedPosts(): Post[] {
    const start = (this.currentPage - 1) * this.postsPerPage;
    return this.posts.slice(start, start + this.postsPerPage);
  }

  nextPage(): void {
    if (this.currentPage * this.postsPerPage < this.posts.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
