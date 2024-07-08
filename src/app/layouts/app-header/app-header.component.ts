import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { BaseComponent } from '../../core/components/base.component';
import { AuthService } from '../../data/services/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { Observable, tap } from 'rxjs';
import { DepartmentDto } from '../../data/types/department.dto';
import { DepartmentService } from '../../data/services/department.service';
import { CommonModule } from '@angular/common';
import { LOCAL_STORAGE_DEPARTMENT_KEY } from '../../core/common/constants';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from '../../shared/module/shared.module';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent extends BaseComponent implements OnInit {

  public sidebarVisible = false;
  public selectedDepartment: DepartmentDto | undefined;
  public selectDepartmentData$ = new Observable<DepartmentDto[]>(); 
  
  constructor(
    public authService: AuthService,
    private readonly departmentService: DepartmentService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectDepartmentData$ = this.departmentService.getListDepartment(this.authService.getAuthState().userId!).pipe(
      tap((response) => {
        // hơi bựa thôi fix chạy đc đã 
        const departmentCurrent = response.find(department => department.id === this.departmentService.getDepartmentnState().id);
        this.selectedDepartment = departmentCurrent;
      })
    );
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
