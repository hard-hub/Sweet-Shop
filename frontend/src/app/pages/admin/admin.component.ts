import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetsService, Sweet } from '../../services/sweets.service';
import { AuthService } from '../../services/auth.service';
import { SweetFormComponent } from '../../components/sweet-form/sweet-form.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, SweetFormComponent, ReactiveFormsModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent {
    private sweetsService = inject(SweetsService);
    private authService = inject(AuthService);

    sweets = this.sweetsService.sweets;
    user = this.authService.currentUser;

    // Filter
    searchControl = new FormControl('');
    searchQuery = signal('');

    // Modal State
    showModal = false;
    editingSweet: Sweet | null = null;

    constructor() {
        this.searchControl.valueChanges.subscribe(v => this.searchQuery.set(v || ''));
    }

    logout() {
        this.authService.logout();
    }

    // Stats
    totalProducts = computed(() => this.sweets().filter(s => !s.isDeleted).length); // Assuming admin sees soft deleted? Logic says admin sees all or filter? 
    // Let's assume admin sees active ones normally but soft deleted management is extra constraint.
    // Re-reading logic: SweetsService.getAllSweets() only returns non-deleted. 
    // So stats are based on active.

    lowStock = computed(() => this.sweets().filter(s => s.quantity > 0 && s.quantity < 10).length);
    outOfStock = computed(() => this.sweets().filter(s => s.quantity === 0).length);

    filteredSweets = computed(() => {
        const search = this.searchQuery().toLowerCase();
        return this.sweets().filter(s =>
            s.name.toLowerCase().includes(search) && !s.isDeleted
        );
    });

    // Actions
    openAddModal() {
        this.editingSweet = null;
        this.showModal = true;
    }

    openEditModal(sweet: Sweet) {
        this.editingSweet = sweet;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.editingSweet = null;
    }

    onSave(sweetData: Partial<Sweet>) {
        if (this.editingSweet) {
            this.sweetsService.updateSweet(this.editingSweet.id, sweetData).subscribe(() => this.closeModal());
        } else {
            this.sweetsService.createSweet(sweetData).subscribe(() => this.closeModal());
        }
    }

    onDelete(id: string) {
        if (confirm('Are you sure you want to delete this sweet?')) {
            this.sweetsService.deleteSweet(id).subscribe();
        }
    }
}
