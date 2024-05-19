import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExternalLoginDto } from '../data/dto/ExternalLoginDto.dto';
import { AuthResponseDto } from '../data/dto/auth-responseDto.dto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public verifyExternalLogin(externalLogin: ExternalLoginDto){
    return this.httpClient.post<AuthResponseDto>(`${environment.apiEndpoint}/api/Auth`, externalLogin);
  }
}
