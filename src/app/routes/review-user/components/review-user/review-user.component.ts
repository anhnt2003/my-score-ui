import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BaseComponent } from '../../../../core/components/base.component';
import { TableModule } from 'primeng/table';
import { OrganizationService } from '../../../../data/services/organization.service';
import { GetPagedOrganizationUserReq } from '../../../../data/types/get-paged-organization-user-req';
import { Observable, Subject, catchError, filter, forkJoin, of, switchMap, takeUntil, tap } from 'rxjs';
import { PagedResult } from '../../../../data/types/paged-result';
import { OrganizationUserDto } from '../../../../data/types/organization-user.dto';
import { DialogModule } from 'primeng/dialog';
import { CategoryDto } from '../../../../data/types/category.dto';
import { CategoryService } from '../../../../data/services/category.service';
import { CategoryResponseDto } from '../../../../data/types/category-response.dto';
import { PanelModule } from 'primeng/panel';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScoreService } from '../../../../data/services/score.service';

@Component({
  selector: 'app-review-user',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    DialogModule,
    PanelModule,
    InputNumberModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './review-user.component.html',
  styleUrl: './review-user.component.scss'
})
export class ReviewUserComponent extends BaseComponent implements OnInit{
  public organizationUser: OrganizationUserDto[] = [];
  public categoriesSkill: CategoryDto[] = [];
  public categoryEnterScoreSubject = new Subject<CategoryDto[]>();
  public categoryEnterScore$: Observable<CategoryDto[]> = this.categoryEnterScoreSubject.asObservable();
  public reviewUserDialog: boolean = false;
  public addScoreForm: FormGroup;
  public formSubmitSubject = new Subject<void>();

  private organizationId!: number;
  private formSubmited$ = this.formSubmitSubject.asObservable();

  constructor(
    private organizationService: OrganizationService,
    private categoryService: CategoryService,
    private scoreService: ScoreService,
    private fb: FormBuilder
  ) {
    super();
    this.addScoreForm = this.fb.group({
      userId: [, Validators.required],
      organizationId: [,Validators.required],
      scoreEntered: [, Validators.required],
      categoryId:[, Validators.required],
      reviewBy:[, Validators.required]
    })
  }

  ngOnInit(): void {
    this.organizationId = parseInt(JSON.parse(localStorage.getItem("organization_context") || '{"id": "1"}').id || '1');
    this.submitAddCoreForm();
    const params: GetPagedOrganizationUserReq = {
      organizationId: this.organizationId,
      skip: 0,
      take: 10
    }

    let categoryEnterScoreTemp: CategoryDto[] = [];

    this.organizationService.getPagedOrganizationUser(params).pipe(
      tap((res: PagedResult<OrganizationUserDto>) => {
        this.organizationUser = res.data;
      }),
      switchMap(() => this.categoryService.getCategory(this.organizationId, null)),
      tap((childCategories: CategoryResponseDto) => {
        this.categoriesSkill = childCategories.data;
      }),
      switchMap((childCategories: CategoryResponseDto) => 
        forkJoin(childCategories.data.map(category => 
          this.categoryService.getListCategoryEnterScore(category.id).pipe(
            tap((categoryEnterScore: CategoryResponseDto) => {
              categoryEnterScoreTemp = [...categoryEnterScoreTemp, ...categoryEnterScore.data];
              this.categoryEnterScoreSubject.next(categoryEnterScoreTemp);
            }),
            catchError(err => of(err))
          ))
        )
      ),
      catchError(err => of(err))
    ).subscribe();
  }

  openReviewDialog(){
    this.reviewUserDialog = true;
  }

  private submitAddCoreForm(){
    
  }
}
