import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { BaseComponent } from '../../../../core/components/base.component';
import {
  OrganizationService,
} from '../../../../data/services/organization.service';
import {
  OrganizationUserDto,
} from '../../../../data/types/organization-user.dto';
import { DefaultPagingOptions } from '../../../../shared/common/constants';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { Subject, catchError, debounceTime, filter, merge, of, takeUntil, tap } from 'rxjs';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { UserService } from '../../../../data/services/user.service';
import { UserDto } from '../../../../data/types/user.dto';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

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
  public pagingOptions = DefaultPagingOptions;
  public visibleAddUserDialog = false;
  public listUsersFound: UserDto[] = [];
  public selectedUserModel: number | undefined;
  public positionTitleModel: string | undefined;

  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl: ElementRef | undefined;
  @ViewChild('paginator') paginator: PaginatorState | undefined;
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedOrganizationUser(1, 0, 10);
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedOrganizationUser(
        1, 
        this.paginator?.page, 
        this.paginator?.pageCount, 
        this.searchTermEl?.nativeElement.value);
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
   
  }

  private loadPagedOrganizationUser(organizationId: number, pageIndex = 0, pageSize = DefaultPagingOptions.pageSize , searchTerm?: string) {
    this.organizationService.getPagedOrganizationUser({ 
      organizationId: organizationId, 
      take: pageSize, 
      skip: pageSize * pageIndex, 
      searchTerm: searchTerm 
    }).pipe(
      takeUntil(this.destroyed$)
    )
    .subscribe(reponse => {
      this.organizationUserData = reponse.data;
      console.log('fetch data organization user');
    });
  }
}
