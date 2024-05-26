import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CreateOrganizationReq } from '../types/create-organization.req';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private readonly httpClient: HttpClient) { }

  createOrganization(params: CreateOrganizationReq) {
    return this.httpClient.post(`${environment.apiEndpoint}/organization`, params);
  }
}
