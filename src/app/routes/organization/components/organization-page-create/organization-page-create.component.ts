import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  filter,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import {
  OrganizationService,
} from '../../../../data/services/organization.service';

@Component({
  selector: 'app-organization-page-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-page-create.component.html',
  styleUrl: './organization-page-create.component.scss'
})
export class OrganizationPageCreateComponent extends BaseComponent implements OnInit {

  public registerForm: FormGroup = new FormGroup({});
  public formSubmitSubject = new Subject<void>();

  private formSubmited$ = this.formSubmitSubject.asObservable();

  constructor(
    private readonly fb: FormBuilder,
    private readonly organizationService: OrganizationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initRegisterForm();
    this.submitCreateForm();
  }

  private initRegisterForm(): void {
    this.registerForm = this.fb.group({
      name: [, Validators.required],
      code: ['', Validators.nullValidator]
    });
  }

  private submitCreateForm() {
    this.formSubmited$.pipe(
      filter(() => this.registerForm.valid),
      switchMap(() => this.organizationService.createOrganization({
        name: this.registerForm.value.name,
        code: this.registerForm.value.code
      })),
      takeUntil(this.destroyed$)
    ).subscribe();
  }
}
