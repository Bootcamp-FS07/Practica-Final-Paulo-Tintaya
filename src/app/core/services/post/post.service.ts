import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Post, Author } from '../../../shared/models/post.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postUrl = environment.apiUrl + '/post';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postUrl, { headers: this.buildAuthHeaders() }).pipe(
      map(posts =>
        posts
          .map(post => ({
            ...post,
            author: post.author
              ? (typeof post.author === 'object' && '$oid' in post.author
                  ? { _id: (post.author as { $oid: string }).$oid, username: '' }
                  : typeof post.author === 'string'
                    ? { _id: post.author, username: '' }
                    : post.author)
              : { _id: 'unknown', username: 'unknown' }
          }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      )
    );
  }

  addPost(text: string): Observable<Post> {
    const userId = localStorage.getItem('userId');
    const body = { text, author: userId };
    return this.http.post<Post>(this.postUrl, body, { headers: this.buildAuthHeaders() });
  }

  updatePost(postId: string, text: string): Observable<Post> {
    const body = { text };
    return this.http.patch<Post>(`${this.postUrl}/${postId}`, body, { headers: this.buildAuthHeaders() });
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.postUrl}/${postId}`, { headers: this.buildAuthHeaders() });
  }

  private buildAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
