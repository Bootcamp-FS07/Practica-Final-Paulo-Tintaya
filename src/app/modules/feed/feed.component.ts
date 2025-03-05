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
      next: (post) => {
        this.newPostText = '';
        this.loadPosts();
      },
      error: (err) => { console.error('Error adding post:', err); }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
