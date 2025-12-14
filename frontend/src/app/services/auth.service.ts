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
                    // In a real app we might decode the token, but assuming backend returns user object or we mock it
                    // Based on previous plan, let's mock the user state or rely on correct API response if updated
                    // Actually, let's trust the response 'user' object if it exists, otherwise decode or mock
                    // For this PoC, we update the signal
                    this.currentUser.set(res.user || { id: 'dec-id', email: credentials.email, role: 'USER' });
                })
            );
    }

    register(data: { email: string; password: string; role?: 'USER' | 'ADMIN' }) {
        return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/register`, data)
            .pipe(
                tap(res => {
                    localStorage.setItem('token', res.token);
                    this.currentUser.set(res.user || { id: 'new-id', email: data.email, role: data.role || 'USER' });
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
