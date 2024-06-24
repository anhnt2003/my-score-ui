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
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { ScoreService } from '../../../../data/services/score.service';
import { CategoryToReviewDto } from '../../../../data/types/category-to-review.dto';
import { CategoryToReviewResponseDto } from '../../../../data/types/category-to-review-response.dto';
import { ScoreDto } from '../../../../data/types/score.dto';

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
    ReactiveFormsModule,
    InputTextModule
  ],
  templateUrl: './review-user.component.html',
  styleUrl: './review-user.component.scss'
})
export class ReviewUserComponent extends BaseComponent implements OnInit{
  public organizationUser: OrganizationUserDto[] = [];
  public categoriesSkill: CategoryToReviewDto[] = [];
  public categoryEnterScoreSubject = new Subject<CategoryDto[]>();
  public categoryEnterScore$: Observable<CategoryDto[]> = this.categoryEnterScoreSubject.asObservable();
  public reviewUserDialog: boolean = false;
  public addScoreForm: FormGroup;
  public formSubmitSubject = new Subject<void>();
  public userScore: ScoreDto[] = [];

  private organizationId!: number;
  private formSubmited$ = this.formSubmitSubject.asObservable();
  private userIdIsReviewed!: number;
  private addScore!: ScoreDto[];

  constructor(
    private organizationService: OrganizationService,
    private categoryService: CategoryService,
    private scoreService: ScoreService,
    private fb: FormBuilder
  ) {
    super();
    this.addScoreForm = this.fb.group({
      entries: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.organizationId = parseInt(JSON.parse(localStorage.getItem("organization_context") || '{"id": "1"}').id || '1');
    this.submitAddCoreForm();
    const params: GetPagedOrganizationUserReq = {
      organizationId: this.organizationId,
      skip: 0,
      take: 10
    }

    this.organizationService.getPagedOrganizationUser(params).pipe(
      tap((res: PagedResult<OrganizationUserDto>) => {
        this.organizationUser = res.data;
      }),
      switchMap(() => this.categoryService.getCategoryToReview(this.organizationId)),
      tap((childCategories: CategoryToReviewResponseDto) => {
        this.categoriesSkill = childCategories.data;
      }),
      catchError(err => of(err))
    ).subscribe();
  }

  openReviewDialog(userId: number){
    this.scoreService.getListScore({organizationId: this.organizationId, userId: userId}).pipe(
      tap((res: ScoreDto[]) => {
        this.userScore = res;
        this.initializeFormEntries();
      }),
      catchError((err) => of(err))
    ).subscribe();
    this.userIdIsReviewed = userId;
    this.reviewUserDialog = true;
  }

  initializeFormEntries() {
    const entries = this.entries;
    entries.clear();
    this.categoriesSkill.forEach((childCategory) => {
      childCategory.categoryChildren.forEach((categoryEnterScore, index) => {
        entries.push(this.fb.group({
          userId: [this.userIdIsReviewed, Validators.required],
          organizationId: [this.organizationId, Validators.required],
          scoreEntered: [this.userScore[index]?.scoreEntered ?? '', Validators.required],
          categoryId: [categoryEnterScore.id, Validators.required],
        }));
      });
    });
  }

  get entries(): FormArray {
    return this.addScoreForm.get('entries') as FormArray;
  }

  private submitAddCoreForm(){
    this.formSubmited$.pipe(
      tap(() => {
        const entries = this.addScoreForm.get('entries') as FormArray;
        this.addScore = [];
        entries.controls.forEach((item) => {
          if(item.value.scoreEntered !== '')
            this.addScore.push(item.value)
        })
      }),
      filter(() => {
        if (this.addScore.length == 0)
          return false;
        return true;
      }),
      switchMap(() => 
        this.scoreService.addScore(this.addScore).pipe(
          tap((data: ScoreDto[]) => {
            this.reviewUserDialog = false;
            this.addScore = [];
          }),
          catchError((err) => of(err))
        )
      ),
      catchError((err) => {
        console.log(err);
        return of(err)
      })
    ).subscribe();
  }
}
