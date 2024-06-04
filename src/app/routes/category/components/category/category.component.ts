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
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastService } from '../../../../data/services/toast.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    RouterLink,
    TableModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [
    MessageService,
    ToastService,
    ConfirmationService
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent extends BaseComponent implements OnInit{
  public parentCategory: CategoryDto[] = [];
  public addCateVisible: boolean = false;
  public categoryString: string = "";
  public fixNameVisible: {[key: number]: boolean} = {};

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private readonly messageService: MessageService,
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
    this.addCateVisible = true;
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
      tap(() => {
        this.addCateVisible = false;
      }),
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

  deleteCategory(categoryId: number){
    this.categoryService.deleteCategory(categoryId).pipe(
      tap((res) => {
        this.toastService.success(res.message)
      }),
      catchError((err) => {
        return of(err);
      }),
      switchMap(() => {
        return this.categoryService.getCategory(2, null).pipe(
          tap((parentCategory: CategoryResponseDto) => {
            this.parentCategory = parentCategory.data;
          }),
          catchError((err) => {
            return of(err);
          })
        )
      }),
      catchError((err) => {
        console.log('Overall error:', err);
        return of(err);
      })
    ).subscribe();

  }

  navigateToChild(id: number | null){
    this.router.navigateByUrl(`/child-category/${id}`);
  }

  toggleFixNameVisible(id: number, state: boolean) {
    this.fixNameVisible[id] = state;
  }

  deleteConfirm(event: Event, categoryId: number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Xóa tiêu chí này đồng nghĩa với xóa tất cả các tiêu chí con, bạn có chắc chắn?',
        header: 'Xác nhận',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
          this.deleteCategory(categoryId);
        },
        reject: () => {
        }
    });
}
}
