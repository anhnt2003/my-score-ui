import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { AuthService } from '../../../../data/services/auth.service';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { DepartmentDto } from '../../../../data/types/department.dto';
import { SharedModule } from '../../../../shared/module/shared.module';
import {
  DepartmentCreateFormComponent,
} from '../department-create-form/department-create-form.component';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    DepartmentCreateFormComponent,
    SharedModule
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent extends BaseComponent implements OnInit {
  @Input() dialogVisibleValue: boolean = false;
  public listDepartmentsData$ = new Observable<DepartmentDto[]>();
  public userId = this.authService.getAuthState().userId ?? 0;

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.initListDepartments();
  }

  private initListDepartments() {
    this.listDepartmentsData$ = this.departmentService.getListDepartment(this.userId);
  }

  public handleOpenDialog() {
    this.dialogVisibleValue = true;
  }

  public handleCloseDialog(department: DepartmentDto) {
    this.dialogVisibleValue = false;
    this.departmentService.saveContext(department);
    this.router.navigate(['']);
  }
  
  public navigateToDepartment(department: DepartmentDto) {
    this.departmentService.saveContext(department);
    this.router.navigate(['']);
  }
}
