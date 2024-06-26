import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import {
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { BaseComponent } from '../../core/components/base.component';
import { AuthService } from '../../data/services/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { Observable } from 'rxjs';
import { DepartmentDto } from '../../data/types/department.dto';
import { DepartmentService } from '../../data/services/department.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [ButtonModule, AutoCompleteModule, OverlayPanelModule, DropdownModule, CommonModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent extends BaseComponent implements OnInit {

  public sidebarVisible = false;
  public selectedDepartment = new FormControl();
  public selectDepartmentData$ = new Observable<DepartmentDto[]>(); 
  constructor(
    public authService: AuthService,
    private readonly departmentService: DepartmentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectDepartmentData$ = this.departmentService.getListDepartment(this.authService.getAuthState().userId!);
  }

  public logOut() {
    this.authService.logOut();
    location.reload();
  }
}
