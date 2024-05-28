import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BaseComponent } from '../../../../core/components/base.component';
import { CategoryService } from '../../../../data/services/category.service';
import { catchError, of, switchMap, tap } from 'rxjs';
import { CategoryResponseDto } from '../../../../data/types/category-response.dto';
import { CategoryDto } from '../../../../data/types/category.dto';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent extends BaseComponent implements OnInit{
  public parentCategory: CategoryDto[] = [];
  public visible: boolean = false;
  public categoryString: string = "";

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {
    super();
  }
  
  ngOnInit(): void {
    this.categoryService.getCategory(2, null).pipe(
      tap((parentCategory: CategoryResponseDto) => {
        this.parentCategory = parentCategory.data;
      }),
      catchError((err) => of(err))
    ).subscribe();
  }

  showDialog() {
    this.visible = true;
  }

  uploadParentCategory(){
    const categoryReq: CategoryDto[] = this.categoryString.trim()
    .split(",")
    .filter(item => item !== '')
    .map(item => ({
      name: item,
      organizationId: 2 // Fix cứng
    }));
    this.categoryService.postCategory(categoryReq).pipe(
      switchMap(() => {
        return this.categoryService.getCategory(2, null).pipe(
          tap((parentCategory: CategoryResponseDto) => {
            this.parentCategory = parentCategory.data;
          }),
          catchError((err) => of(err))
        )
      }),
      catchError((err) => {
        return of(err)
      })
    ).subscribe();
    
    this.categoryString = "";
  }

  navigateToChild(id: number | undefined){
    this.router.navigateByUrl(`/child-category/${id}`);
  }
}
