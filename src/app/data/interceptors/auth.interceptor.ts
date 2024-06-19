import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DepartmentService } from '../services/department.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authState = inject(AuthService).authState.value;
  const departmentState = inject(DepartmentService).departmentState.value;
  if (authState) {
    const authReq = request.clone({
      setHeaders: { 
        Authorization: `Bearer ${authState.token}`,
        DepartmentId: `${departmentState ? departmentState.id : null}`
      }
    });
    return next(authReq);
  }
  return next(request);
};
