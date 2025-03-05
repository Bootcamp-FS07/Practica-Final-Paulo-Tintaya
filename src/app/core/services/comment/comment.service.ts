import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment';
import { Comment } from '../../../shared/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = environment.apiUrl;
  private endpoint = 'comment';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getComments(postId: string): Observable<Comment[]> {
    const params = new HttpParams().set('postId', postId);
    const url = `${this.apiUrl}/${this.endpoint}`;
    return this.http.get<Comment[]>(url, { params, headers: this.buildAuthHeaders() });
  }

  addComment(text: string, postId: string): Observable<Comment> {
    const userId = localStorage.getItem('userId');
    const body = { text, author: userId, post: postId };
    const url = `${this.apiUrl}/${this.endpoint}`;
    return this.http.post<Comment>(url, body, { headers: this.buildAuthHeaders() });
  }

  updateComment(commentId: string, text: string, postId: string): Observable<Comment> {
    const userId = localStorage.getItem('userId');
    const body = { text, author: userId, post: postId };
    const url = `${this.apiUrl}/${this.endpoint}/${commentId}`;
    return this.http.patch<Comment>(url, body, { headers: this.buildAuthHeaders() });
  }

  deleteComment(commentId: string): Observable<any> {
    const url = `${this.apiUrl}/${this.endpoint}/${commentId}`;
    return this.http.delete(url, { headers: this.buildAuthHeaders() });
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
