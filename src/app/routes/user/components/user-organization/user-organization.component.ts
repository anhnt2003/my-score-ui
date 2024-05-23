import { Component } from '@angular/core';
import { TableModule} from 'primeng/table'; 
import { PaginatorModule } from 'primeng/paginator';
import { User } from '../../../../user';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-user-organization',
  standalone: true,
  imports: [TableModule, IconFieldModule, InputIconModule],
  templateUrl: './user-organization.component.html',
  styleUrl: './user-organization.component.scss'
})
export class UserOrganizationComponent {

  user!: User[];
}
