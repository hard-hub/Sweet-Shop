import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm: FormGroup = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    isLoading = false;

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            const { email, password } = this.loginForm.value;

            this.authService.login({ email, password }).subscribe({
                next: () => {
                    // Navigation will theoretically happen here, but for now just log
                    console.log('Logged in!');
                    this.isLoading = false;
                    // Temporarily redirect to nothing or dashboard if we had it
                    // this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false;
                    alert('Login failed! Check credentials.');
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
