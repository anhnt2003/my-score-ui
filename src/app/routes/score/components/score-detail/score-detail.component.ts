import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {
  PaginatorModule,
  PaginatorState,
} from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { AuthService } from '../../../../data/services/auth.service';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { ScoreService } from '../../../../data/services/score.service';
import { DefaultPagingOptions } from '../../../../shared/common/constants';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../data/services/category.service';
import { ScoreTableData } from '../../../../data/types/score-data-table';
import { ButtonModule } from 'primeng/button';
import { CategoryDto } from '../../../../data/types/category.dto';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ScoreDto } from '../../../../data/types/score.dto';
import { CategoryToReviewDto } from '../../../../data/types/category-to-review.dto';

@Component({
  selector: 'app-score-detail',
  standalone: true,
  imports: [
    TableModule, 
    IconFieldModule, 
    InputIconModule, 
    PaginatorModule,
    DialogModule,
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    PanelModule
  ],
  templateUrl: './score-detail.component.html',
  styleUrl: './score-detail.component.scss'
})
export class ScoreDetailComponent extends BaseComponent implements OnInit, AfterViewInit {

  public existedCategorySubject = new BehaviorSubject<boolean>(false); 
  public existedCategoryData$ = this.existedCategorySubject.asObservable();
  public scoreDetailData: ScoreTableData[] = [];
  public pagingOptions = DefaultPagingOptions;
  public totalCountData: number = 0;
  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();
  public userId = this.authService.getAuthState().userId ?? 0;
  public departmentId = this.departmentService.getDepartmentnState().id ?? 0;
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

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl: ElementRef | undefined;
  @ViewChild('paginator') paginator: PaginatorState | undefined;

  constructor(
    private readonly scoreService: ScoreService,
    private readonly departmentService: DepartmentService,
    private readonly categoryService: CategoryService,
    private authService: AuthService,
    private fb: FormBuilder,
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
    this.loadPagedScoreEmployee(this.departmentId);
    this.checkExistedCategory();
    this.submitAddCoreForm();
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedScoreEmployee(this.departmentId);
    });
  }

  private checkExistedCategory() {
    this.categoryService.getCategory(this.departmentId, null).pipe(
      takeUntil(this.destroyed$),
    ).subscribe((result) => {
      if(result.length < 1) {
        this.existedCategorySubject.next(true);
      }
    });
  }

  public openReviewDialog(userId: number){
    this.scoreService.getListScore({departmentId: this.departmentId, userId: userId}).pipe(
      tap((res: ScoreDto[]) => {
        this.userScore = res;
        this.initializeFormEntries();
      }),
      catchError((err) => of(err))
    ).subscribe();
    this.userIdIsReviewed = userId;
    this.reviewUserDialog = true;
  }

  private loadPagedScoreEmployee(departmentId: number, pageIndex = 0, pageSize = DefaultPagingOptions.pageSize, searchTerm?: string) {
    this.scoreService.getPagedScore({
      departmentId: departmentId,
      take: pageSize,
      skip: pageIndex * pageSize,
      searchTerm: searchTerm
    }).pipe(
      map(response => {
        const scoreMap = response.data.reduce((acc, score) => {
          const key = score.email;
          if (!acc[key]) {
            acc[key] = {
              email: score.email,
              avatar: score.avatar,
              userId: score.userId,
              scoreArray: [] as unknown as [{ categoryName: string; categoryId: number; scoreCalculated: number }],
            };
          }
          acc[key].scoreArray.push({
            categoryName: score.categoryName,
            categoryId: score.categoryId,
            scoreCalculated: score.scoreCalculated
          });
          return acc;
        }, {} as { [key: string]: ScoreTableData });
        return Object.values(scoreMap);
      }),
      takeUntil(this.destroyed$)
    ).subscribe((response: ScoreTableData[]) => {
        this.scoreDetailData = response;
        console.log(this.scoreDetailData);
        console.log('fetch data score employees successful');
      },
    );
  }

  private initializeFormEntries() {
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

  private get entries(): FormArray {
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
        this.scoreService.createScore(this.addScore).pipe(
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
