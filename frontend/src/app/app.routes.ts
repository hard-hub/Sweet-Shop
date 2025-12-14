import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] }
];
