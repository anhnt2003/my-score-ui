import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { BaseComponent } from '../../core/components/base.component';
import { AuthService } from '../../data/services/auth.service';
import { OrganizationDto } from '../../data/types/organization.dto';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [OverlayPanelModule, ButtonModule, AutoCompleteModule, FormsModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent extends BaseComponent {

  public selectedOrganization: OrganizationDto[] = [];
  public filteredOrganization: OrganizationDto[] = [];
  constructor(
    public authService: AuthService
  ) {
    super();
  }

  public organizationFilter(event: AutoCompleteCompleteEvent) {}

  public logOut() {
    this.authService.logOut();
    location.reload();
  }
}
