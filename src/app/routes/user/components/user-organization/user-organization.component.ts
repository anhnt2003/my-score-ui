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
import { ConfirmationService, ConfirmEventType } from 'primeng/api';

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
  providers: [
    ConfirmationService
  ],
  templateUrl: './user-organization.component.html',
  styleUrls: ['./user-organization.component.scss']
})
export class UserOrganizationComponent extends BaseComponent implements OnInit, AfterViewInit {

  public organizationUserData: OrganizationUserDto[] = [];
  public totalCountData: number = 0;
  public pagingOptions = DefaultPagingOptions;
  public visibleAddUserDialog = false;
  public confirmDialogVisible = false;
  public listUsersFound: UserDto[] = [];
  public selectedUserModel: UserDto | undefined;
  public positionTitleModel: string | undefined;
  public perPageModel: number = 0;
  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();
  public userId = this.authService.getAuthState().userId ?? 0;
  public organizationId = this.organizationService.getOrganizationState().id ?? 0;
  private userIdToDelete: number | null = null;
  public fixNameVisible: boolean = true;

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl: ElementRef | undefined;
  @ViewChild('paginator') paginator: PaginatorState | undefined;

  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private confirmationService: ConfirmationService,
    public authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedOrganizationUser(this.organizationId);
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
    if (!this.selectedUserModel || !this.positionTitleModel) {
      console.error('Selected user or position title is missing.');
      return;
    }

    const payload = {
      organizationId: this.organizationId,
      userId: this.selectedUserModel.id,
      positionTitle: this.positionTitleModel
    };

    console.log('Sending payload to create organization user:', payload);

    this.organizationService.CreateOrganizationUser(payload).pipe(
      takeUntil(this.destroyed$),
      catchError((error) => {
        console.error('Error creating organization user:', error);
        return of(null);
      })
    ).subscribe((result) => {
      if (result) {
        this.loadPagedOrganizationUser(this.organizationId, this.paginator?.page, this.paginator?.pageCount, this.searchTermEl?.nativeElement.value);
        this.visibleAddUserDialog = false;
      }
    });
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
    .subscribe(response => {
      this.organizationUserData = response.data;
      this.totalCountData = response.total;
      console.log('fetch data organization user successful');
    }, error => {
      console.error('Error fetching organization users:', error);
    });
  }

  public editUser() : void{
    console.log('')
  }


  public confirmDeleteUser(userId: number){
    console.log('confirmDeleteUser called with userId:', userId);
    this.userIdToDelete = userId;
    this.confirmDialogVisible = true;
  }

  public deleteUser(){
    if (this.userIdToDelete !== null) {
      console.log('Deleting user with userId:', this.userIdToDelete);

      const payload = {
        organizationId: this.organizationId,
        userId: this.userIdToDelete
      };

      console.log('Sending payload to delete organization user:', payload);

      this.organizationService.DeleteOrganizationUser(payload).pipe(
        takeUntil(this.destroyed$),
        catchError((error) => {
          console.error('Error deleting organization user:', error);
          return of(null);
        })
      ).subscribe((result) => {
        if (result) {
          console.log('User deleted:', this.userIdToDelete);
          this.loadPagedOrganizationUser(this.organizationId, this.paginator?.page, this.paginator?.pageCount, this.searchTermEl?.nativeElement.value);
          this.confirmDialogVisible = false;
          this.userIdToDelete = null;
        }
      });
    }
  }
}
