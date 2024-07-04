import {
  Component,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';

import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import {
  catchError,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { CategoryService } from '../../../../data/services/category.service';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { ToastService } from '../../../../data/services/toast.service';
import { CategoryDto } from '../../../../data/types/category.dto';
import { SharedModule } from '../../../../shared/module/shared.module';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink
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
  
  private departmentId = this.departmentService.getDepartmentnState().id ?? 0;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private readonly messageService: MessageService,
    private departmentService: DepartmentService
  ) {
    super();
  }
  
  ngOnInit(): void {
    this.categoryService.getCategoryByParentId({
      departmentId: this.departmentId,
      parentId: undefined
    }).pipe(
      tap((parentCategory: CategoryDto[]) => {
        this.parentCategory = parentCategory;
        console.log(parentCategory);
        
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
      departmentId: this.departmentId
    }));

    this.categoryService.createCategory(categoryReq).pipe(
      tap(() => {
        this.addCateVisible = false;
      }),
      switchMap(() => {
        return this.categoryService.getCategoryByParentId({
          departmentId: this.departmentId,
          parentId: undefined
        }).pipe(
          tap((parentCategory: CategoryDto[]) => {
            this.parentCategory = parentCategory;
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

  updateNameCategory(categoryId: number, categoryName: string){
    this.categoryService.updateCategory({
      id: categoryId,
      departmentId: this.departmentId,
      name: categoryName
    }).pipe(
      tap((res) => {
        this.fixNameVisible[categoryId] = false;
        this.toastService.success("");
      }),
      catchError((err) => {
        this.toastService.fail(err);
        return of(err);
      }),
      switchMap(() => {
        return this.categoryService.getCategoryByParentId({
          departmentId: this.departmentId,
          parentId: undefined
        }).pipe(
          tap((parentCategory: CategoryDto[]) => {
            this.parentCategory = parentCategory;
          }),
          catchError((err) => {
            return of(err);
          })
        )
      })
    ).subscribe();
  }

  deleteCategory(categoryId: number){
    this.categoryService.deleteCategory(categoryId).pipe(
      tap((res) => {
        this.toastService.success("")
      }),
      catchError((err) => {
        return of(err);
      }),
      switchMap(() => {
        return this.categoryService.getCategoryByParentId({
          departmentId: this.departmentId,
          parentId: undefined
        }).pipe(
          tap((parentCategory: CategoryDto[]) => {
            this.parentCategory = parentCategory;
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
