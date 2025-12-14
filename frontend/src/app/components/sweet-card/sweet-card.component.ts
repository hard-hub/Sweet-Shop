import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sweet, SweetsService } from '../../services/sweets.service';

@Component({
    selector: 'app-sweet-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sweet-card.component.html',
    styleUrls: ['./sweet-card.component.css']
})
export class SweetCardComponent {
    @Input({ required: true }) sweet!: Sweet;
    private sweetsService = inject(SweetsService);

    quantity = 1;
    isPurchasing = false;

    getIcon(category: string): string {
        const lower = category.toLowerCase();
        if (lower.includes('chocolate')) return '🍫';
        if (lower.includes('candy') || lower.includes('gummy')) return '🍬';
        if (lower.includes('cake') || lower.includes('baked')) return '🍰';
        return '🍭';
    }

    increment() {
        if (this.quantity < this.sweet.quantity) {
            this.quantity++;
        }
    }

    decrement() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    onPurchase() {
        this.isPurchasing = true;
        this.sweetsService.purchase(this.sweet.id, this.quantity).subscribe({
            next: () => {
                alert('Purchase Successful! 🎉');
                this.isPurchasing = false;
                this.quantity = 1; // Reset
            },
            error: (err) => {
                console.error(err);
                alert('Failed to purchase. ' + (err.error?.message || 'Check stock or network.'));
                this.isPurchasing = false;
            }
        });
    }
}
