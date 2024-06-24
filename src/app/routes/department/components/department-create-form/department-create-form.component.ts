import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { BaseComponent } from '../../../../core/components/base.component';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, catchError, filter, finalize, of, switchMap, takeUntil } from 'rxjs';
import { DepartmentService } from '../../../../data/services/department.service';
import { LOCAL_STORAGE_DEPARTMENT_KEY } from '../../../../core/common/constants';
import { DepartmentDto } from '../../../../data/types/department.dto';

@Component({
  selector: 'app-department-create-form',
  standalone: true,
  imports: [
    DialogModule, 
    ButtonModule, 
    FloatLabelModule, 
    IconFieldModule, 
    FormsModule, 
    ReactiveFormsModule, 
    InputTextModule
  ],
  templateUrl: './department-create-form.component.html',
  styleUrl: './department-create-form.component.scss'
})
export class DepartmentCreateFormComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Output() dialogVisibleChange = new EventEmitter<DepartmentDto>();
  @Input() visibleDialog: boolean = false;
  public registerForm: FormGroup = new FormGroup({});
  public formSubmitSubject = new Subject<void>();

  private formSubmited$ = this.formSubmitSubject.asObservable();
  
  constructor(
    private fb: FormBuilder,
    private readonly departmentService: DepartmentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: [, Validators.required],
      code: [, Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.formSubmited$.pipe(
      filter(() => this.registerForm.valid),
      switchMap(() => this.departmentService.createDepartment({
        name: this.registerForm.value.name,
        code: this.registerForm.value.code
      }).pipe(
        catchError(() => {
          return of(null);
        }),
      )),
      takeUntil(this.destroyed$)
    ).subscribe((result) => {
      if(result) {
        this.dialogVisibleChange.emit(result);
      }
    });
  }
}
