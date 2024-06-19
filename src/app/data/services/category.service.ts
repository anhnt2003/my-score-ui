import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CategoryResponseDto } from '../types/category-response.dto';
import { CategoryDto } from '../types/category.dto';
import { MessageRes } from '../types/message-response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private httpClient: HttpClient
  ) { }
  
  public getCategory(departmentId: number, parentId: number | null){
    let parentIdParam = parentId === null ? '' : `&parentId=${parentId}`;

    return this.httpClient.get<CategoryResponseDto>(`${environment.apiEndpoint}/Category?departmentId=${departmentId}${parentIdParam}`);
  }

  public postCategory(categoryList: CategoryDto[]){
    return this.httpClient.post<CategoryResponseDto["data"]>(`${environment.apiEndpoint}/Category`, categoryList);
  }

  public deleteCategory(categoryId: number){
    return this.httpClient.delete<MessageRes>(`${environment.apiEndpoint}/Category/?categoryId=${categoryId}`);
  }
}
