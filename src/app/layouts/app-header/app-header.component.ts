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

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [ButtonModule, AutoCompleteModule, OverlayPanelModule, DropdownModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent extends BaseComponent implements OnInit {

  public sidebarVisible = false;
  public selectedDepartment = new FormControl();
  constructor(
    public authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
   
  }

  public logOut() {
    this.authService.logOut();
    location.reload();
  }

}
