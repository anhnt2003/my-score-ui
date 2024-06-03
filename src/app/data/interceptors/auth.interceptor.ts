import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OrganizationService } from '../services/organization.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authState = inject(AuthService).authState.value;
  const organizationState = inject(OrganizationService).organizationState.value;
  if (authState) {
    const authReq = request.clone({
      setHeaders: { 
        Authorization: `Bearer ${authState.token}`,
        OrganizationId: `${organizationState ? organizationState.id : null}`
      }
    });
    return next(authReq);
  }
  return next(request);
};
