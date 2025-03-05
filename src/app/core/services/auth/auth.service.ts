import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../../../shared/models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('These are invalid credentials :c');
    }

    const data: AuthResponse = await response.json();
    localStorage.setItem('token', data.access_token);

    // Save user ID if provided; otherwise, fetch profile
    if (data.user && data.user._id) {
      localStorage.setItem('userId', data.user._id);
    } else {
      await this.fetchUserProfile();
    }

    return data;
  }

  // Added signup method
  async signup(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.apiUrl}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    if (!response.ok) {
      throw new Error('Signup failed');
    }
    const data: AuthResponse = await response.json();
    return data;
  }

  // Optional: Fetch user profile to get user ID if not returned during login
  async fetchUserProfile(): Promise<void> {
    const token = this.getToken();
    if (!token) return;
    const response = await fetch(`${environment.apiUrl}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    const user = await response.json();
    if (user && user._id) {
      localStorage.setItem('userId', user._id);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
