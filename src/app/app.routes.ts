import { Routes } from '@angular/router';

import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import {
  AuthLayoutComponent,
} from './routes/auth/components/auth-layout/auth-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'auth',
                pathMatch: 'full',
                redirectTo: '/login'
            },
            {
                path: 'login',
                loadComponent: () => import('./routes/auth/components/login/login.component').then((c) => c.LoginComponent)
            }
        ]
    },
    {
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/dashboard'
            },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./routes/dashboard/components/dashboard/dashboard.component').then((c) => c.DashboardComponent)
            },
        ]
    }
];
