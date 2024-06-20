import { CanActivateFn, Router } from '@angular/router';
import { DepartmentService } from '../../data/services/department.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const departmentContextGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const service = inject(DepartmentService)
  
  return service.existedDepartmentContext$.pipe(
    tap((existedDepartment) => {
      if(!existedDepartment) {
        router.navigate(['/department']);
      };
    }),
  );
};
