import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  map,
  switchMap,
} from 'rxjs';

import { SocialAuthService } from '@abacritt/angularx-social-login';

import { environment } from '../../../environments/environment';
import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_DEPARTMENT_KEY,
} from '../../core/common/constants';
import { AuthContext } from '../models/auth-context';
import { AuthResponseDto } from '../types/auth-response.dto';
import { ExternalLoginDto } from '../types/external-login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public authState = new BehaviorSubject<AuthContext>(JSON.parse(localStorage[LOCAL_STORAGE_AUTH_KEY] || null));
  public isAuthenticated$ = this.authState.asObservable().pipe(map(context => context !== null));

  constructor( 
    private externalAuthService: SocialAuthService,
    private httpClient: HttpClient
  ) {
    this.externalAuthService.authState.pipe(
      switchMap(externalLogin => {
        return this.verifyExternalLogin(externalLogin);
      })
    ).subscribe((authResponse) => {
      const authContext: AuthContext = {
        userId: authResponse.userId,
        userName: authResponse.userName,
        email: authResponse.email,
        token: authResponse.token,
        roles: authResponse.roles,
        avatar: authResponse.avatar
      };
      this.authState.next(authContext);
      localStorage[LOCAL_STORAGE_AUTH_KEY] = JSON.stringify(authContext);
    });
  }

  public getAuthState() {
    return this.authState.value;
  }

  public verifyExternalLogin(externalLogin: ExternalLoginDto){
    return this.httpClient.post<AuthResponseDto>(`${environment.apiEndpoint}/Auth`, externalLogin);
  }

  public logOut() {
    this.externalAuthService.signOut();
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    sessionStorage.removeItem(LOCAL_STORAGE_DEPARTMENT_KEY);
  }
}
