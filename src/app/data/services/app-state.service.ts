import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { OrganizationService } from './organization.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  constructor(
    private athService: AuthService,
    private organizationService: OrganizationService
  ) { }

  private initAppState() {}
}
