import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExternalLoginDto } from '../types/external-login.dto';
import { AuthResponseDto } from '../types/auth-response.dto';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public verifyExternalLogin(externalLogin: ExternalLoginDto){
    return this.httpClient.post<AuthResponseDto>(`${environment.apiEndpoint}/Auth`, externalLogin);
  }
}
