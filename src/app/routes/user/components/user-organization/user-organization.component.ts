import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
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
  OrganizationService,
} from '../../../../data/services/organization.service';
import { UserService } from '../../../../data/services/user.service';
import {
  OrganizationUserDto,
} from '../../../../data/types/organization-user.dto';
import { UserDto } from '../../../../data/types/user.dto';
import { DefaultPagingOptions } from '../../../../shared/common/constants';

@Component({
  selector: 'app-user-organization',
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
  templateUrl: './user-organization.component.html',
  styleUrl: './user-organization.component.scss'
})
export class UserOrganizationComponent extends BaseComponent implements OnInit, AfterViewInit {

  public organizationUserData: OrganizationUserDto[] = [];
  public totalCountData: number = 0;
  public pagingOptions = DefaultPagingOptions;
  public visibleAddUserDialog = false;
  public listUsersFound: UserDto[] = [];
  public selectedUserModel: UserDto | undefined;
  public positionTitleModel: string | undefined;
  public perPageModel: number = 0;
  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();
  public userId = this.authService.getAuthState().userId ?? 0;
  public organizationId = this.organizationService.getOrganizationState().id ?? 0;

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl: ElementRef | undefined;
  @ViewChild('paginator') paginator: PaginatorState | undefined;
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedOrganizationUser(10008);
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedOrganizationUser(
        this.organizationId, 
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
    this.organizationService.CreateOrganizationUser({
      organizationId: this.organizationId,
      userId: this.selectedUserModel?.id ?? 0,
      positionTitle: this.positionTitleModel ?? ''
    }).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((result) => {
      this.loadPagedOrganizationUser(this.organizationId, this.paginator?.page, this.paginator?.pageCount, this.searchTermEl?.nativeElement.value);
      this.visibleAddUserDialog = false;
    })
  }

  private loadPagedOrganizationUser(organizationId: number, pageIndex = 0, pageSize = DefaultPagingOptions.pageSize , searchTerm?: string) {
    this.organizationService.getPagedOrganizationUser({ 
      organizationId: organizationId, 
      take: pageSize, 
      skip: pageSize * pageIndex, 
      searchTerm: searchTerm ?? ''
    }).pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe(reponse => {
      this.organizationUserData = reponse.data;
      this.totalCountData = reponse.total;
      console.log('fetch data organization user successful');
    });
  }
}
