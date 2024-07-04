import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CategoryDto } from '../types/category.dto';
import { GetCategoryByParentIdReq } from '../types/get-category-by-parentId-req';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient
  ) { }
  
  public getCategory(departmentId: number){
    return this.httpClient.get<CategoryDto[]>(`${environment.apiEndpoint}/Category`, {
      params: { departmentId }
    });
  }

  public getCategoryByParentId(params: GetCategoryByParentIdReq){
    return this.httpClient.get<CategoryDto[]>(`${environment.apiEndpoint}/Category/get-by-parentId`, {
      params: { ...params }
    });    
  }

  public createCategory(categoryList: CategoryDto[]){
    return this.httpClient.post<CategoryDto[]>(`${environment.apiEndpoint}/Category`, categoryList);
  }

  public updateCategory(category: CategoryDto){
    return this.httpClient.put<CategoryDto>(`${environment.apiEndpoint}/Category`, category); 
  }

  public deleteCategory(categoryId: number){
    return this.httpClient.delete<string>(`${environment.apiEndpoint}/Category/${categoryId}`);
  }
}
