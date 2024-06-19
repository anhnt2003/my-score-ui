import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  constructor(
    private athService: AuthService,
  ) { }

  private initAppState() {}
}
