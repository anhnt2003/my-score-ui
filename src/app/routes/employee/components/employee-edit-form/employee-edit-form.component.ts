import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BaseComponent } from '../../../../core/components/base.component';
import { EmployeeDto } from '../../../../data/types/employee.dto';

@Component({
  selector: 'app-employee-edit-form',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, FormsModule, ButtonModule],
  templateUrl: './employee-edit-form.component.html',
  styleUrl: './employee-edit-form.component.scss'
})
export class EmployeeEditFormComponent extends BaseComponent implements OnChanges {

  public visiableValue: boolean = false;
  @Input() employeeData: EmployeeDto | null = null;
  @Output() visibleDialogChange = new EventEmitter<boolean>();
  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const inputChanged = changes['employeeData'];
    if(!!inputChanged) {
      this.visiableValue = true;
    }
  }
}
