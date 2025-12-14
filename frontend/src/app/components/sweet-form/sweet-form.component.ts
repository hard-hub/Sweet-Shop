import { Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Sweet } from '../../services/sweets.service';

@Component({
    selector: 'app-sweet-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './sweet-form.component.html',
    styleUrls: ['./sweet-form.component.css']
})
export class SweetFormComponent implements OnChanges {
    @Input() sweet: Sweet | null = null; // If present, Edit mode
    @Output() save = new EventEmitter<Partial<Sweet>>();
    @Output() cancel = new EventEmitter<void>();

    private fb = inject(FormBuilder);

    form: FormGroup = this.fb.group({
        name: ['', Validators.required],
        category: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        quantity: [0, [Validators.required, Validators.min(0)]]
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (this.sweet) {
            this.form.patchValue(this.sweet);
        } else {
            this.form.reset({ price: 0, quantity: 0 });
        }
    }

    onSubmit() {
        if (this.form.valid) {
            this.save.emit(this.form.value);
        }
    }
}
