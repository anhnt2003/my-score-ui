import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { GetUserReq } from '../types/get-user-req';
import { OrganizationUserDto } from '../types/organization-user.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly httpClient: HttpClient) { }

  getUserById(params: GetUserReq) {
    return this.httpClient.get<OrganizationUserDto>(`${environment.apiEndpoint}/organization/get-user`, {
      params: { ...params }
    });
  }
}
