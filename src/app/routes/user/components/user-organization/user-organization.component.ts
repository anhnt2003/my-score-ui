import {
  Component,
  OnInit,
} from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';

import { BaseComponent } from '../../../../core/components/base.component';
import {
  OrganizationService,
} from '../../../../data/services/organization.service';
import {
  OrganizationUserDto,
} from '../../../../data/types/organization-user.dto';

@Component({
  selector: 'app-user-organization',
  standalone: true,
  imports: [TableModule, IconFieldModule, InputIconModule],
  templateUrl: './user-organization.component.html',
  styleUrl: './user-organization.component.scss'
})
export class UserOrganizationComponent extends BaseComponent implements OnInit {

  organizationUserData: OrganizationUserDto[] = [];
  constructor(
    private readonly organizationService: OrganizationService
  ) {
    super();
  }
  ngOnInit(): void {
  }
}
