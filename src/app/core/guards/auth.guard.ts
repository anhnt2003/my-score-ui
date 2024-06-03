import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../data/services/auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) => {
  const router = inject(Router);
  const service = inject(AuthService)
  
  return service.isAuthenticated$.pipe(
    tap((isAuthticated) => {
      if(!isAuthticated) {
        router.navigate(['/auth/login']);
      };
    }),
  );
}
