import { Component, Input } from '@angular/core';
import { DepartmentCreateFormComponent } from '../department-create-form/department-create-form.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [DepartmentCreateFormComponent, ButtonModule, CardModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent {
  @Input() dialogVisibleValue: boolean = false;

  public handleOpenDialog() {
    this.dialogVisibleValue = true
  }
}
