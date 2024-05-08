import { Routes } from '@angular/router';

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
                loadComponent: () => import('./routes/auth/components/login/login.component').then((m) => m.LoginComponent)
            }
        ]
    }
];
