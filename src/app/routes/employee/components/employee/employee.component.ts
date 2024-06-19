import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../core/components/base.component';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { EmployeeDto } from '../../../../data/types/employee.dto';
import { DefaultPagingOptions } from '../../../../shared/common/constants';
import { UserDto } from '../../../../data/types/user.dto';
import { Subject, catchError, debounceTime, filter, merge, of, takeUntil, tap } from 'rxjs';
import { EmployeeService } from '../../../../data/services/employee.service';
import { UserService } from '../../../../data/services/user.service';
import { AuthService } from '../../../../data/services/auth.service';
import { DepartmentService } from '../../../../data/services/department.service';

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
    InputTextModule
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
        this.searchTermEl?.nativeElement.value ?? null);
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

  public handleAddUser() {
    this.employeeService.CreateEmployee({
      departmentId: this.departmentId,
      userId: this.selectedUserModel?.id ?? 0,
      jobTitle: this.jobTitleModel ?? ''
    }).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedEmployee(this.departmentId, this.paginator?.page, this.paginator?.pageCount, this.searchTermEl?.nativeElement.value);
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
