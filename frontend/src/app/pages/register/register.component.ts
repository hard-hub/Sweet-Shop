import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    registerForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['USER', Validators.required]
    });

    isLoading = false;

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    alert('Registration Successful! Welcome 🍬');
                    this.isLoading = false;
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false;
                    alert('Registration failed. ' + (err.error?.message || 'Try again.'));
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
