import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetPagedEmployeeReq } from '../types/get-paged-employee-req';
import { PagedResult } from '../types/paged-result';
import { environment } from '../../../environments/environment';
import { EmployeeDto } from '../types/employee.dto';
import { CreateEmployeeReq } from '../types/create-employee-req';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private readonly httpClient: HttpClient) { }

  public getPagedEmployee(params: GetPagedEmployeeReq) {
    return this.httpClient.get<PagedResult<EmployeeDto>>(`${environment.apiEndpoint}/employee/get-paged`, {
      params: { ...params }
    });
  }

  public getEmployeeById(userId: number) {
    return this.httpClient.get<EmployeeDto>(`${environment.apiEndpoint}/employee/${userId}`);
  }

  public CreateEmployee(params: CreateEmployeeReq) {
    return this.httpClient.post<EmployeeDto>(`${environment.apiEndpoint}/employee`, params);
  }

  public DeleteEmployee(employeeId: number) {
    return this.httpClient.delete(`${environment.apiEndpoint}/employee/${employeeId}`);
  }
}
