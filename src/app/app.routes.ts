import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import {
  organizationExsitedGuard,
} from './core/guards/organization-exsited.guard';
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
            },
        ]
    },
    {
        path: 'organization-create',
        canActivate: [authGuard],
        loadComponent: () => 
            import('./routes/organization/components/organization-page-create/organization-page-create.component').then((c) => c.OrganizationPageCreateComponent)
    },
    {
        path: '',
        canActivate: [authGuard, organizationExsitedGuard],
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
            {
                path: 'score-user-detail',
                loadComponent: () => 
                    import('./routes/score/components/score-detail/score-detail.component').then((c) => c.ScoreDetailComponent)
            },
            {
                path: 'user-organization',
                loadComponent: () => 
                    import('./routes/user/components/user-organization/user-organization.component').then((c) => c.UserOrganizationComponent)
            },
  {
                path: 'category',
                loadComponent: () => 
                    import('./routes/category/components/category/category.component').then((c) => c.CategoryComponent)
            },
            {
                path: 'child-category/:id',
                loadComponent: () => 
                    import('./routes/child-category/components/child-category/child-category.component').then((c) => c.ChildCategoryComponent)
            },
            {
                path: 'organization-page-list',
                loadComponent: () => 
                    import('./routes/organization/components/organization-page-list/organization-page-list.component').then((c) => c.OrganizationPageListComponent)
            },
            {
                path: 'review',
                loadComponent: () => 
                    import('./routes/review-user/components/review-user/review-user.component').then((c) => c.ReviewUserComponent)
            }
        ]
    }
];
