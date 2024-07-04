import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import {
  BehaviorSubject,
  catchError,
  merge,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { AuthService } from '../../../../data/services/auth.service';
import { CategoryService } from '../../../../data/services/category.service';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { EmployeeService } from '../../../../data/services/employee.service';
import { ToastService } from '../../../../data/services/toast.service';
import { CategoryDto } from '../../../../data/types/category.dto';
import { EmployeeDto } from '../../../../data/types/employee.dto';
import { DefaultPagingOptions } from '../../../../shared/common/constants';
import { SharedModule } from '../../../../shared/module/shared.module';
import {
  EmployeeCreateDialogComponent,
} from '../employee-create-dialog/employee-create-dialog.component';
import { EmployeeEditFormComponent } from '../employee-edit-form/employee-edit-form.component';
import { EmployeeReviewFormComponent } from '../employee-review-form/employee-review-form.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    SharedModule,
    EmployeeCreateDialogComponent,
    EmployeeEditFormComponent,
    EmployeeReviewFormComponent
  ],
  providers: [
    ConfirmationService,
    MessageService,
    ToastService
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent extends BaseComponent implements OnInit, AfterViewInit {

  public employeeData: EmployeeDto[] = [];
  public employeeInfoData!: EmployeeDto;
  public categoryData: CategoryDto[] = [];
  public totalCountData: number = 0;
  public pagingOptions = DefaultPagingOptions;
  public perPageModel: number = 0;
  public userId = this.authService.getAuthState().userId ?? 0;
  public departmentId = this.departmentService.getDepartmentnState().id ?? 0;
  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();
  public existedCategorySubject = new BehaviorSubject<boolean>(false); 
  public existedCategory$ = this.existedCategorySubject.asObservable();
  public visibleAddEmployeeSubject = new BehaviorSubject<boolean>(false);
  public visibleAddEmployee$ = this.visibleAddEmployeeSubject.asObservable();
  public visibleEditEmployeeSubject = new BehaviorSubject<boolean>(false);
  public visibleEditEmployee$ = this.visibleEditEmployeeSubject.asObservable();  
  public visibleReviewEmployeeSubject = new BehaviorSubject<boolean>(false);
  public visibleReviewEmployee$ = this.visibleReviewEmployeeSubject.asObservable();

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl: ElementRef | undefined;
  @ViewChild('paginator') paginator: PaginatorState | undefined;
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly categoryService: CategoryService,
    private readonly departmentService: DepartmentService,
    private readonly toastService: ToastService,
    private confirmationService: ConfirmationService,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedEmployee(this.departmentId);
    this.checkExistedCategory();
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedEmployee(
        this.departmentId, 
        this.paginator?.page, 
        this.paginator?.pageCount, 
        this.searchTermEl?.nativeElement.value
      );
    });
  }

  private checkExistedCategory() {
    this.categoryService.getCategory(this.departmentId).pipe(
      tap((response) => {
        const categoryTree = response.reduce((pre, cur) => {
          pre[cur.id!] = { ...cur, children: [] };
          return pre
        }, [] as CategoryDto[]);

        response.forEach(item => {
          if (item.parentId === null) {
            this.categoryData.push(categoryTree[item.id!]);
          } else {
            categoryTree[item.parentId!].children!.push(categoryTree[item.id!]);
          }
        });
      }),
      takeUntil(this.destroyed$),
    ).subscribe((result) => {
      if (result.length < 1) {
        this.existedCategorySubject.next(true);
      };
    });
  }

  public openReviewDialog(employee: EmployeeDto) {
    this.employeeInfoData = employee;
    this.visibleReviewEmployeeSubject.next(true);
  }

  public openAddUserDialog() {
    this.visibleAddEmployeeSubject.next(true);
  }

  public closeAddUserDialog() {
    this.visibleAddEmployeeSubject.next(false);
    this.loadPagedEmployee(this.departmentId);
  }

  public openReviewEmployeeForm(categories: CategoryDto[]) {
    this.visibleReviewEmployeeSubject.next(true);
  }

  public openEditEmployeeForm(employee: EmployeeDto) {
    this.employeeInfoData = employee;
    this.visibleEditEmployeeSubject.next(true);
  }

  public handleDeleteEmployee(event: Event, employee: EmployeeDto) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Bạn có muốn xoá nhân viên ${employee.email} không`,
      header: 'Xác nhận xoá nhân viên',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Xác nhận',
      rejectLabel: 'Huỷ',

      accept: () => {
        this.employeeService.DeleteEmployee(employee.id).pipe(
          takeUntil(this.destroyed$),
          catchError((error) => {
            return of(error);
          })
        ).subscribe((result) => {
          if (result) {
            this.loadPagedEmployee(
              this.departmentId, 
              this.paginator?.page, 
              this.paginator?.pageCount, 
              this.searchTermEl?.nativeElement.value
            );
          };
          this.toastService.success('Xoá nhân viên thành công')
        });
      },
    });
  }

  private loadPagedEmployee(departmentId: number, pageIndex = 0, pageSize = DefaultPagingOptions.pageSize , searchTerm: string = '') {
    this.employeeService.getPagedEmployee({ 
      departmentId: departmentId, 
      take: pageSize, 
      skip: pageSize * pageIndex, 
      searchTerm: searchTerm
    }).pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe(reponse => {
      this.employeeData = reponse.data;
      this.totalCountData = reponse.total;
      console.log('fetch data employees successful');
    });
  }
}
