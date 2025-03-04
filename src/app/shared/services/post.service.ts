import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/post';

  constructor(private authService: AuthService) {}

  async getPosts(): Promise<any[]> {
    const token = this.authService.getToken();
    const response = await fetch(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    return await response.json();
  }
}
