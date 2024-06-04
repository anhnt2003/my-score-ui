import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  BehaviorSubject,
  catchError,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { SocialAuthService } from '@abacritt/angularx-social-login';

import { environment } from '../../../environments/environment';
import {
  LOCAL_STORAGE_AUTH_KEY,
  LOCAL_STORAGE_ORGANIZATION_KEY,
} from '../../core/common/constants';
import { AuthContext } from '../types/auth-context';
import { AuthResponseDto } from '../types/auth-response.dto';
import { ExternalLoginDto } from '../types/external-login.dto';
import { OrganizationService } from './organization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public authState = new BehaviorSubject<AuthContext>(JSON.parse(localStorage[LOCAL_STORAGE_AUTH_KEY] || null));
  public isAuthenticated$ = this.authState.asObservable().pipe(map(context => context !== null));

  constructor( 
    private externalAuthService: SocialAuthService,
    private organizationService: OrganizationService,
    private httpClient: HttpClient
  ) {
    this.externalAuthService.authState.pipe(
      switchMap(socialUser => { 
        return this.verifyExternalLogin(socialUser).pipe(
          catchError(() => of()),
        )
      }),
      switchMap((authResponse: AuthResponseDto) => {
        return this.organizationService.getListOrganization(authResponse.userId).pipe(
          tap((orgResponse) => {
            const firstOrgResponse = orgResponse[0];
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
            if(firstOrgResponse) {
              this.organizationService.organizationState.next(firstOrgResponse);
              localStorage[LOCAL_STORAGE_ORGANIZATION_KEY] = JSON.stringify(firstOrgResponse);
            }
          })
        )
      }),
      catchError(() => of(null))
    ).subscribe()
  }

  public verifyExternalLogin(externalLogin: ExternalLoginDto){
    return this.httpClient.post<AuthResponseDto>(`${environment.apiEndpoint}/Auth`, externalLogin);
  }

  public logOut() {
    this.externalAuthService.signOut();
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ORGANIZATION_KEY);
  }
}
