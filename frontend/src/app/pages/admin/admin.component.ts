import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SweetsService, Sweet } from '../../services/sweets.service';
import { AuthService } from '../../services/auth.service';
import { SweetFormComponent } from '../../components/sweet-form/sweet-form.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
    totalProducts = computed(() => this.sweets().filter(s => !s.isDeleted).length);
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
            this.sweetsService.updateSweet(this.editingSweet.id, sweetData).subscribe({
                next: () => {
                    this.closeModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Updated!',
                        text: 'Sweet has been updated.',
                        confirmButtonColor: '#ff416c',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        } else {
            this.sweetsService.createSweet(sweetData).subscribe({
                next: () => {
                    this.closeModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Created!',
                        text: 'New sweet added to stock.',
                        confirmButtonColor: '#ff416c',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        }
    }

    onDelete(id: string) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ff416c',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.sweetsService.deleteSweet(id).subscribe(() => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Sweet has been deleted.',
                        icon: 'success',
                        confirmButtonColor: '#ff416c'
                    });
                });
            }
        });
    }
}
