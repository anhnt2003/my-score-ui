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
  catchError,
  filter,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import {
  OrganizationService,
} from '../../../../data/services/organization.service';
import { Router } from '@angular/router';
import { LOCAL_STORAGE_ORGANIZATION_KEY } from '../../../../core/common/constants';

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
    private readonly organizationService: OrganizationService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.initRegisterForm();
    this.submitCreateForm();
    this.organizationService.existedOrganization$.pipe(
      filter((existedOrganization) => existedOrganization),
      tap(() => this.router.navigate([''])),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  private initRegisterForm(): void {
    this.registerForm = this.fb.group({
      name: [, Validators.required],
      code: [, Validators.nullValidator],
      positionTitle: [, Validators.required]
    });
  }

  private submitCreateForm() {
    this.formSubmited$.pipe(
      filter(() => this.registerForm.valid),
      switchMap(() => this.organizationService.createOrganization({
        name: this.registerForm.value.name,
        code: this.registerForm.value.code,
        positionTitle: this.registerForm.value.positionTitle
      }).pipe(
        catchError(() => of(null)),
      )),
      takeUntil(this.destroyed$)
    ).subscribe((response) => {
      if(response) {
        localStorage[LOCAL_STORAGE_ORGANIZATION_KEY] = JSON.stringify(response);
        setTimeout(() => {
          location.reload();
        }, 1500);
      }
    });
  }
}
