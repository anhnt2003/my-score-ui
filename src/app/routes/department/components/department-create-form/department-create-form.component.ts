import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  catchError,
  filter,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { DepartmentDto } from '../../../../data/types/department.dto';
import { SharedModule } from '../../../../shared/module/shared.module';

@Component({
  selector: 'app-department-create-form',
  standalone: true,
  imports: [
    SharedModule
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
