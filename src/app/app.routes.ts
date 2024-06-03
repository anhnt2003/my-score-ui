import { Routes } from '@angular/router';

import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import {
  AuthLayoutComponent,
} from './routes/auth/components/auth-layout/auth-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { organizationExsitedGuard } from './core/guards/organization-exsited.guard';

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
            },
        ]
    },
    {
            canActivate: [authGuard],
            path: 'organization-create',
            loadComponent: () => 
                import('./routes/organization/components/organization-page-create/organization-page-create.component').then((c) => c.OrganizationPageCreateComponent)
    },
    {
        path: '',
        component: AppLayoutComponent,
        // canActivate: [authGuard, organizationExsitedGuard],
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
            {
                path: 'user-organization',
                loadComponent: () => 
                    import('./routes/user/components/user-organization/user-organization.component').then((c) => c.UserOrganizationComponent)
            },
            {
                path: 'score-user-detail',
                loadComponent: () => 
                    import('./routes/score/components/score-detail/score-detail.component').then((c) => c.ScoreDetailComponent)
            }
        ]
    }
];
