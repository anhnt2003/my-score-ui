import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import {
  catchError,
  debounceTime,
  filter,
  of,
  takeUntil,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { EmployeeService } from '../../../../data/services/employee.service';
import { UserService } from '../../../../data/services/user.service';
import { UserDto } from '../../../../data/types/user.dto';
import { SharedModule } from '../../../../shared/module/shared.module';

@Component({
  selector: 'app-employee-create-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './employee-create-dialog.component.html',
  styleUrl: './employee-create-dialog.component.scss'
})
export class EmployeeCreateDialogComponent extends BaseComponent {

  public listUsersFound: UserDto[] = [];
  public selectedUserModel!: UserDto;
  public jobTitleModel!: string;
  public departmentId = this.departmentService.getDepartmentnState().id ?? 0;
  
  @Input() visibleDialog: boolean = false;

  @Output() visibleEventChange = new EventEmitter<boolean>();

  constructor(
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
    private readonly departmentService: DepartmentService
  ) {
    super();
  }

  public userFilter(event: AutoCompleteCompleteEvent) {
    this.userService.getListUser(event.query).pipe(
      filter((searchTerm) => searchTerm.length >= 1),
      tap(() => debounceTime(1000)),
      catchError(() => of([])),
      takeUntil(this.destroyed$)
    ).subscribe((result) => this.listUsersFound = result);
  }

  public handleAddUser() {
    this.employeeService.CreateEmployee({
      departmentId: this.departmentId,
      userId: this.selectedUserModel?.id,
      jobTitle: this.jobTitleModel
    }).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => this.closeDialog());
  }

  public closeDialog() {
    this.visibleEventChange.emit(false);
  }
}
