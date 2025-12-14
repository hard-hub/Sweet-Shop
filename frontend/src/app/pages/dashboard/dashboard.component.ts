import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SweetsService, Sweet } from '../../services/sweets.service';
import { AuthService } from '../../services/auth.service';
import { SweetCardComponent } from '../../components/sweet-card/sweet-card.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SweetCardComponent],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    private sweetsService = inject(SweetsService);
    private authService = inject(AuthService);

    user = this.authService.currentUser;
    sweets = this.sweetsService.sweets;

    // Filter Controls
    searchControl = new FormControl('');
    categoryControl = new FormControl('');
    priceControl = new FormControl(100);

    // Search Query Signals
    searchQuery = signal('');
    categoryQuery = signal('');
    maxPriceQuery = signal(100);

    constructor() {
        this.searchControl.valueChanges.subscribe(v => this.searchQuery.set(v || ''));
        this.categoryControl.valueChanges.subscribe(v => this.categoryQuery.set(v || ''));
        this.priceControl.valueChanges.subscribe(v => this.maxPriceQuery.set(v || 100));
    }

    logout() {
        this.authService.logout();
    }

    // Computed Values
    totalProducts = computed(() => this.sweets().length);
    availableProducts = computed(() => this.sweets().filter(s => s.quantity > 0).length);

    categories = computed(() => [...new Set(this.sweets().map(s => s.category))]);

    filteredSweets = computed(() => {
        const search = this.searchQuery().toLowerCase();
        const cat = this.categoryQuery();
        const maxPrice = this.maxPriceQuery();

        return this.sweets().filter(sweet => {
            const matchName = sweet.name.toLowerCase().includes(search);
            const matchCat = cat ? sweet.category === cat : true;
            const matchPrice = sweet.price <= maxPrice;
            return matchName && matchCat && matchPrice && !sweet.isDeleted;
        });
    });
}
