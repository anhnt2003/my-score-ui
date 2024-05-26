import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CategoryResponseDto } from '../types/category-response.dto';
import { CategoryDto } from '../types/category.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient
  ) { }
  
  public getCategory(organizationId: number, parentId: number | null){
    let parentIdParam = parentId === null ? '' : `&parentId=${parentId}`;

    return this.httpClient.get<CategoryResponseDto>(`${environment.apiEndpoint}/Category?organizationId=${organizationId}${parentIdParam}`);
  }

  public postCategory(categoryList: CategoryDto[]){
    return this.httpClient.post<CategoryResponseDto["data"]>(`${environment.apiEndpoint}/Category`, categoryList);
  }
}
