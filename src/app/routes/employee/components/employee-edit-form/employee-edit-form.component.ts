import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BaseComponent } from '../../../../core/components/base.component';
import { EmployeeDto } from '../../../../data/types/employee.dto';
import { Subject, catchError, filter, of, switchMap, takeUntil } from 'rxjs';
import { EmployeeService } from '../../../../data/services/employee.service';

@Component({
  selector: 'app-employee-edit-form',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule, FormsModule, ButtonModule],
  templateUrl: './employee-edit-form.component.html',
  styleUrl: './employee-edit-form.component.scss'
})
export class EmployeeEditFormComponent extends BaseComponent implements OnChanges, OnInit, AfterViewInit {

  public visiableEditForm: boolean = false;
  public formSubmitSubject = new Subject<void>();
  public employeeEditForm: FormGroup = new FormGroup({});

  private formSubmited$ = this.formSubmitSubject.asObservable();

  @Input() visibleEditEmployeeForm!: boolean;
  @Input() employeeData!: EmployeeDto;
  
  @Output() visibleEventChange = new EventEmitter<boolean>();
  constructor(
    private readonly employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const inputChanged = changes['employeeData'];
    if(!!inputChanged) {
      this.visiableEditForm = true;
      this.initializeForm();
    }
  }

  ngAfterViewInit(): void {
    this.formSubmited$.pipe(
      filter(() => this.employeeEditForm.valid),
      switchMap(() => this.employeeService.updateEmployee({
        employeeId: this.employeeData?.id,
        jobTitle: this.employeeEditForm.value.jobTitle
      }).pipe(
        catchError(() => {
          return of(null);
        }),
      )),
      takeUntil(this.destroyed$)
    ).subscribe((result) => {
      if(result) {
        this.closeDialog();
      }
    });
  }

  private initializeForm() {
    this.employeeEditForm = this.fb.group({
      jobTitle: [this.employeeData?.jobTitle, Validators.required]
    })
  }

  public closeDialog() {
    this.visibleEventChange.emit(false);
  }
}
