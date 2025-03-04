import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { PostService } from '../../shared/services/post.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css'
})
export class FeedComponent implements OnInit{
  posts: any[] = [];

  constructor(private authService: AuthService, private router: Router, private postService: PostService) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  async ngOnInit() {
    try {
      this.posts = await this.postService.getPosts();
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

}
