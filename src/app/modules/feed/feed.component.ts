import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../shared/models/post.model';
import { PostService } from '../../core/services/post/post.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  newPostText = '';
  editingPostId: string | null = null;
  editPostText: string = '';

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => { this.posts = posts; },
      error: (err) => { console.error('Error fetching posts:', err); }
    });
  }

  addPost(): void {
    if (!this.newPostText.trim()) return;
    this.postService.addPost(this.newPostText).subscribe({
      next: () => {
        this.newPostText = '';
        this.loadPosts();
      },
      error: (err) => { console.error('Error adding post:', err); }
    });
  }

  getAuthorId(post: Post): string {
    return post.author._id;
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

  saveEdit(postId: string): void {
    if (!this.editPostText.trim()) return;
    this.postService.updatePost(postId, this.editPostText).subscribe({
      next: () => {
        this.cancelEditing();
        this.loadPosts();
      },
      error: (err) => { console.error('Error editing post:', err); }
    });
  }

  deletePost(postId: string): void {
    if (confirm("Are you sure you want to delete this post?")) {
      this.postService.deletePost(postId).subscribe({
        next: () => this.loadPosts(),
        error: (err) => { console.error('Error deleting post:', err); }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
