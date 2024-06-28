import { AuthContext } from './auth-context';
import { DepartmentContext } from './department-context';

export interface AppSate {
    userContext: AuthContext;

    departmentContext: DepartmentContext;
}