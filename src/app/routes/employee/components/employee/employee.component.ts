import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ConfirmationService,
  MessageService,
} from 'primeng/api';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import {
  PaginatorModule,
  PaginatorState,
} from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import {
  catchError,
  debounceTime,
  filter,
  merge,
  of,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { AuthService } from '../../../../data/services/auth.service';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { EmployeeService } from '../../../../data/services/employee.service';
import { ToastService } from '../../../../data/services/toast.service';
import { UserService } from '../../../../data/services/user.service';
import { EmployeeDto } from '../../../../data/types/employee.dto';
import { UserDto } from '../../../../data/types/user.dto';
import { DefaultPagingOptions } from '../../../../shared/common/constants';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    TableModule, 
    IconFieldModule, 
    InputIconModule, 
    ButtonModule, 
    DialogModule, 
    AutoCompleteModule, 
    FormsModule, 
    PaginatorModule,
    FloatLabelModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule
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
  public totalCountData: number = 0;
  public pagingOptions = DefaultPagingOptions;
  public visibleAddUserDialog = false;
  public listUsersFound: UserDto[] = [];
  public selectedUserModel: UserDto | undefined;
  public jobTitleModel: string | undefined;
  public perPageModel: number = 0;
  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();
  public userId = this.authService.getAuthState().userId ?? 0;
  public departmentId = this.departmentService.getDepartmentnState().id ?? 0;

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl: ElementRef | undefined;
  @ViewChild('paginator') paginator: PaginatorState | undefined;
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly departmentService: DepartmentService,
    private readonly userService: UserService,
    private readonly toastService: ToastService,
    private confirmationService: ConfirmationService,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedEmployee(this.departmentId);
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedEmployee(
        this.departmentId, 
        this.paginator?.page, 
        this.paginator?.pageCount, 
        this.searchTermEl?.nativeElement.value ?? null
      );
    });
  }

  public userFilter(event: AutoCompleteCompleteEvent) {
    this.userService.getListUser(event.query).pipe(
      filter((searchTerm) => searchTerm.length >= 1),
      tap(() => debounceTime(1000)),
      catchError(() => of([])),
      takeUntil(this.destroyed$)
    ).subscribe((result) => this.listUsersFound = result);
  }

  public openAddUserDialog() {
    this.visibleAddUserDialog = true;
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

  public handleAddUser() {
    this.employeeService.CreateEmployee({
      departmentId: this.departmentId,
      userId: this.selectedUserModel?.id ?? 0,
      jobTitle: this.jobTitleModel ?? ''
    }).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedEmployee(
        this.departmentId, 
        this.paginator?.page, 
        this.paginator?.pageCount, 
        this.searchTermEl?.nativeElement.value
      );
      this.visibleAddUserDialog = false;
    })
  }

  private loadPagedEmployee(departmentId: number, pageIndex = 0, pageSize = DefaultPagingOptions.pageSize , searchTerm?: string) {
    this.employeeService.getPagedEmployee({ 
      departmentId: departmentId, 
      take: pageSize, 
      skip: pageSize * pageIndex, 
      searchTerm: searchTerm ?? ''
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
