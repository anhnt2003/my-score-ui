import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import {
  AuthLayoutComponent,
} from './routes/auth/components/auth-layout/auth-layout.component';
import { departmentContextGuard } from './core/guards/department-context.guard';

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
        path: 'department',
        canActivate: [authGuard],
        loadComponent: () => import('./routes/department/components/department/department.component').then((c) => c.DepartmentComponent)
    },
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [authGuard, departmentContextGuard],
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
                path: 'score-employee-detail',
                loadComponent: () => 
                    import('./routes/score/components/score-detail/score-detail.component').then((c) => c.ScoreDetailComponent)
            },
            {
                path: 'employee',
                loadComponent: () => 
                    import('./routes/employee/components/employee/employee.component').then((c) => c.EmployeeComponent)
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
        ]
    }
];
