import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  authenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Global user state (mocked)
  currentUser = signal<User | null>(null);

  constructor() { 
    this.checkAuth().subscribe();
  }

  login(credentials: { username: string }): Observable<User> {
    // Mock login model simulation
    const mockUser: User = { id: Date.now(), username: credentials.username, authenticated: true };
    return of(mockUser).pipe(
      delay(800), // Simulate network delay
      tap(user => this.currentUser.set(user))
    );
  }

  signup(credentials: { username: string }): Observable<User> {
    // Mock signup model simulation
    const mockUser: User = { id: Date.now(), username: credentials.username, authenticated: true };
    return of(mockUser).pipe(
      delay(1200), // Simulate network delay
      tap(user => this.currentUser.set(user))
    );
  }

  logout(): Observable<null> {
    // Mock logout
    return of(null).pipe(
      delay(300),
      tap(() => this.currentUser.set(null))
    );
  }

  checkAuth(): Observable<User | null> {
    // Mock auth check (initially null unless we implemented localStorage)
    return of(null);
  }
}
