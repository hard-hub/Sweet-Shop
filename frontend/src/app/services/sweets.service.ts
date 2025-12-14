import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Sweet {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    isDeleted?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class SweetsService {
    private http = inject(HttpClient);
    private apiUrl = '/api/sweets';
    private authService = inject(AuthService);

    // Reactive state for sweets list
    sweets = signal<Sweet[]>([]);

    constructor() {
        this.refreshSweets();
    }

    getHeaders() {
        const token = this.authService.getToken();
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        };
    }

    refreshSweets() {
        this.http.get<Sweet[]>(this.apiUrl).subscribe(data => {
            this.sweets.set(data);
        });
    }

    purchase(sweetId: string, quantity: number) {
        return this.http.post(`${this.apiUrl}/${sweetId}/purchase`, { quantity }, this.getHeaders())
            .pipe(tap(() => this.refreshSweets()));
    }

    createSweet(sweet: Partial<Sweet>) {
        return this.http.post<Sweet>(this.apiUrl, sweet, this.getHeaders())
            .pipe(tap(() => this.refreshSweets()));
    }

    updateSweet(id: string, sweet: Partial<Sweet>) {
        return this.http.put<Sweet>(`${this.apiUrl}/${id}`, sweet, this.getHeaders())
            .pipe(tap(() => this.refreshSweets()));
    }

    deleteSweet(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders())
            .pipe(tap(() => this.refreshSweets()));
    }
}
