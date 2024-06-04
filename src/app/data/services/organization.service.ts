import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CreateOrganizationReq } from '../types/create-organization.req';
import { PagedResult } from '../types/paged-result';
import { OrganizationUserDto } from '../types/organization-user.dto';
import { GetPagedOrganizationUserReq } from '../types/get-paged-organization-user-req';
import { BehaviorSubject, map } from 'rxjs';
import { OrganizationContext } from '../types/organization-context';
import { LOCAL_STORAGE_ORGANIZATION_KEY } from '../../core/common/constants';
import { OrganizationDto } from '../types/organization.dto';
import { CreateOrganizationUserReq } from '../types/create-organization-user.req';
import { DeleteOrganizationUserReq } from '../types/delete-organization-user.req';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  public organizationState = new BehaviorSubject<OrganizationContext>(JSON.parse(localStorage[LOCAL_STORAGE_ORGANIZATION_KEY] || null));
  public organizationState$ = this.organizationState.asObservable();
  public existedOrganization$ = this.organizationState.asObservable().pipe(map(context => context !== null));
  constructor(
    private readonly httpClient: HttpClient
  ) 
  {}

  public createOrganization(params: CreateOrganizationReq) {
    return this.httpClient.post(`${environment.apiEndpoint}/organization`, params);
  }

  public getPagedOrganizationUser(params: GetPagedOrganizationUserReq) {
    return this.httpClient.get<PagedResult<OrganizationUserDto>>(`${environment.apiEndpoint}/organization/get-paged-user`, {
      params: { ...params }
    });
  }

  public getListOrganization(userId: number) {
    return this.httpClient.get<OrganizationDto[]>(`${environment.apiEndpoint}/organization/get-list`, {
      params: { userId }
    });
  }

  public CreateOrganizationUser(params: CreateOrganizationUserReq) {
    return this.httpClient.post<OrganizationUserDto>(`${environment.apiEndpoint}/organization/invite-user`, params);
  }

  public DeleteOrganizationUser(params: DeleteOrganizationUserReq) {
    return this.httpClient.delete<string>(`${environment.apiEndpoint}/organization/${params.organizationId}/${params.userId}`);
  }
}
