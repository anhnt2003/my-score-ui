import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CategoryResponseDto } from '../types/category-response.dto';
import { CategoryDto } from '../types/category.dto';
import { MessageRes } from '../types/message-response';
import { CategoryToReviewResponseDto } from '../types/category-to-review-response.dto';

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

  public getCategoryToReview(organizationId: number){
    return this.httpClient.get<CategoryToReviewResponseDto>(`${environment.apiEndpoint}/Category/enter-scored?organizationId=${organizationId}`);
  }

  public getListCategoryEnterScore(id: number | undefined){
    return this.httpClient.get<CategoryResponseDto>(`${environment.apiEndpoint}/Category/enter-scored?id=${id}`);
  }

  public postCategory(categoryList: CategoryDto[]){
    return this.httpClient.post<CategoryResponseDto["data"]>(`${environment.apiEndpoint}/Category`, categoryList);
  }

  public updateCategory(category: CategoryDto){
    return this.httpClient.put<MessageRes>(`${environment.apiEndpoint}/Category`,category);
  }

  public deleteCategory(categoryId: number){
    return this.httpClient.delete<MessageRes>(`${environment.apiEndpoint}/Category/?categoryId=${categoryId}`);
  }
}
