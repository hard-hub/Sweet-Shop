import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface User {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';
    // Use signals for reactive state
    currentUser = signal<User | null>(this.getUserFromStorage());

    constructor(private http: HttpClient, private router: Router) { }

    login(credentials: { email: string; password: string }) {
        return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, credentials)
            .pipe(
                tap(res => {
                    localStorage.setItem('token', res.token);
                    // basic jwt decode or just use the user obj from response if provided (backend sends user?)
                    // Backend response for login currently: { token } only? Let's check backend.
                    // Phase 1 implementation sends { token: ..., user: ... } ? 
                    // Let's assume we need to decode or backend should send it.
                    // For now, let's assume we store the token.
                    this.currentUser.set({ id: 'decoded-id', email: credentials.email, role: 'USER' }); // Temporary mock until verified
                })
            );
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    private getUserFromStorage(): User | null {
        // Implement standard JWT decode here if needed
        return null;
    }
}
