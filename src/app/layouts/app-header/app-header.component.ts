import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import {
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { BaseComponent } from '../../core/components/base.component';
import { AuthService } from '../../data/services/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { Observable } from 'rxjs';
import { DepartmentDto } from '../../data/types/department.dto';
import { DepartmentService } from '../../data/services/department.service';
import { CommonModule } from '@angular/common';
import { LOCAL_STORAGE_DEPARTMENT_KEY } from '../../core/common/constants';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [
    ButtonModule, 
    AutoCompleteModule, 
    OverlayPanelModule, 
    DropdownModule, 
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent extends BaseComponent implements OnInit {

  public sidebarVisible = false;
  public formGroup!: FormGroup;
  public selectDepartmentData$ = new Observable<DepartmentDto[]>(); 
  
  constructor(
    public authService: AuthService,
    private readonly departmentService: DepartmentService,
    private router: Router
  ) {
    super();
    this.formGroup = new FormGroup({
      selectedDepartment: new FormControl<DepartmentDto | null>(JSON.parse(sessionStorage[LOCAL_STORAGE_DEPARTMENT_KEY]))
    });
  }

  ngOnInit(): void {
    this.selectDepartmentData$ = this.departmentService.getListDepartment(this.authService.getAuthState().userId!);
  }

  public logOut() {
    this.authService.logOut();
    location.reload();
  }

  public changeValueDropDown(event: DropdownChangeEvent){
    sessionStorage[LOCAL_STORAGE_DEPARTMENT_KEY] = JSON.stringify(event.value);
    location.reload();
  }

  public linkToChooseDepartment(){
    this.router.navigate(["/department"]);
  }
}
