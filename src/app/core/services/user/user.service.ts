import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UserProfile {
  _id: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = environment.apiUrl + '/user';

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.userUrl}/${id}`);
  }
}
