import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateDepartmentReq } from '../types/create-department.req';
import { environment } from '../../../environments/environment';
import { DepartmentContext } from '../models/department-context';
import { BehaviorSubject, map } from 'rxjs';
import { LOCAL_STORAGE_DEPARTMENT_KEY } from '../../core/common/constants';
import { DepartmentDto } from '../types/department.dto';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  public departmentState = new BehaviorSubject<DepartmentContext>(JSON.parse(sessionStorage[LOCAL_STORAGE_DEPARTMENT_KEY] || null));
  public existedDepartmentContext$ = this.departmentState.asObservable().pipe(map(context => context !== null));
  constructor(
    private readonly httpClient: HttpClient
  ) 
  {}

  public getDepartmentnState() {
    return this.departmentState.getValue();
  }

  public saveContext(department: DepartmentDto) {
    const departmentContext: DepartmentContext = {
      id: department.id,
      code: department.code,
      name: department.name,
      createdBy: department.createdBy,
      createdDate: department.createdDate
    };
    this.departmentState.next(departmentContext);
    sessionStorage[LOCAL_STORAGE_DEPARTMENT_KEY] = JSON.stringify(departmentContext);
  }

  public createDepartment(params: CreateDepartmentReq) {
    return this.httpClient.post(`${environment.apiEndpoint}/department`, params);
  }

  public getListDepartment(userId: number) {
    return this.httpClient.get<DepartmentDto[]>(`${environment.apiEndpoint}/department`, {
      params: { userId }
    });
  }
}
