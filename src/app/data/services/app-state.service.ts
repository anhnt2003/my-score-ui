import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  merge,
  tap,
} from 'rxjs';

import { AppSate } from '../models/app-state';
import { AuthService } from './auth.service';
import { DepartmentService } from './department.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  public appSate = new BehaviorSubject<AppSate>({} as AppSate);
  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService
  ) { }

  private initAppState() {
    merge(this.authService.isAuthenticated$, this.departmentService.existedDepartmentContext$).pipe(
      tap(() => {
      })
    )
  }
}
