import { Component, Input, OnInit } from '@angular/core';
import { DepartmentCreateFormComponent } from '../department-create-form/department-create-form.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { DepartmentDto } from '../../../../data/types/department.dto';
import { BaseComponent } from '../../../../core/components/base.component';
import { DepartmentService } from '../../../../data/services/department.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../data/services/auth.service';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [DepartmentCreateFormComponent, ButtonModule, CardModule, CommonModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent extends BaseComponent implements OnInit {
  @Input() dialogVisibleValue: boolean = false;
  public listDepartmentsData$ = new Observable<DepartmentDto[]>();
  public userId = this.authService.getAuthState().userId ?? 0;
  // public departmentId = this.departmentService.getDepartmentnState().id ?? 0;

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
