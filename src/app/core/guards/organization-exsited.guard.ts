import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../data/services/auth.service';
import { OrganizationService } from '../../data/services/organization.service';
import { tap } from 'rxjs';

export const organizationExsitedGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(OrganizationService)

  return authService.existedOrganization$.pipe(
    tap((existedOrganization) => {
      if(!existedOrganization) {
        router.navigate(['/organization-create'])
      }
    })
  )
}
