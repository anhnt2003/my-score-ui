import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { PaginatorState } from 'primeng/paginator';
import {
  BehaviorSubject,
  delay,
  finalize,
  map,
  merge,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { AuthService } from '../../../../data/services/auth.service';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { ScoreService } from '../../../../data/services/score.service';
import { ScoreTableData } from '../../../../data/types/score-data-table';
import { DefaultPagingOptions, SortOrderOptions } from '../../../../shared/common/constants';
import { SharedModule } from '../../../../shared/module/shared.module';
import { EmployeeScoreReviewFormComponent } from '../../../../shared/components/employee-score-review-form/employee-score-review-form.component';
import { CategoryDto } from '../../../../data/types/category.dto';
import { CategoryService } from '../../../../data/services/category.service';
import { UserDto } from '../../../../data/types/user.dto';
import { ScoreDataTableDetail } from '../../../../data/types/score-data-table-detail';
import { LoadingService } from '../../../../data/services/loading.service';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-score-detail',
  standalone: true,
  imports: [
    SharedModule,
    EmployeeScoreReviewFormComponent
  ],
  templateUrl: './score-detail.component.html',
  styleUrl: './score-detail.component.scss'
})
export class ScoreDetailComponent extends BaseComponent implements OnInit, AfterViewInit {

  public scoreDetailData: ScoreTableData[] = [];
  public userInfoData!: UserDto;
  public scoreDetailDataDetail: ScoreDataTableDetail[] = [];
  public categories: CategoryDto[] = [];
  public pagingOptions = DefaultPagingOptions;
  public totalCountData: number = 0;
  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();
  public sortingSubject = new Subject<void>();
  public userId = this.authService.getAuthState().userId ?? 0;
  public departmentId = this.departmentService.getDepartmentnState().id ?? 0;
  public displayColumns: string[] = [];
  public visibleReviewEmployeeSubject = new BehaviorSubject<boolean>(false);
  public visibleReviewEmployee$ = this.visibleReviewEmployeeSubject.asObservable();

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();
  private sortingChanged$ = this.sortingSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl!: ElementRef;
  @ViewChild('paginator') paginator!: PaginatorState;
  @ViewChild('sorting') sorting!: SortEvent;

  constructor(
    private readonly scoreService: ScoreService,
    private readonly departmentService: DepartmentService,
    private readonly categoryService: CategoryService,
    public loadingService: LoadingService,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedScoreEmployee(this.departmentId);
    this.categoryService.getCategory(this.departmentId).pipe(
      tap((response) => this.categories = response),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedScoreEmployee(
        this.departmentId,
        this.paginator?.page,
        this.paginator?.pageCount,
        this.searchTermEl?.nativeElement.value,
        this.sorting?.field,
        this.sorting?.order?.toString()
      );
    });
  }

  public openReviewDialog(data: ScoreTableData) {
    const userReview: UserDto = {
      id: data.userId,
      email: data.email,
      userName: data.email,
      avatar: data.avatar
    }
    this.userInfoData = userReview;
    this.scoreDetailDataDetail = data.scoreArray;
    this.visibleReviewEmployeeSubject.next(true);
  }

  public closeReviewDialog(eventClosed: boolean) {
    this.visibleReviewEmployeeSubject.next(false);
    if(eventClosed) {
      this.loadPagedScoreEmployee(this.departmentId);
    }  
  }

  private loadPagedScoreEmployee(departmentId: number, pageIndex = 0, pageSize = DefaultPagingOptions.pageSize, searchTerm: string = '', sortField: string = '', sortOrder: string = '') {
    this.loadingService.showLoading();
    this.scoreService.getPagedScore({
      departmentId: departmentId,
      take: pageSize,
      skip: pageIndex * pageSize,
      searchTerm: searchTerm,
      sortField: sortField,
      sortOrder: sortOrder
    }).pipe(
      map(response => {
        const scoreMap = response.data.reduce((previousValue, currentValue) => {
          const key = currentValue.userId;
          if (!previousValue[key]) {
            previousValue[key] = {
              email: currentValue.email,
              avatar: currentValue.avatar,
              userId: currentValue.userId,
              scoreArray: [],
            };
          }
          previousValue[key].scoreArray = [...previousValue[key].scoreArray, {
            id: currentValue.id,
            categoryName: currentValue.categoryName,
            categoryId: currentValue.categoryId,
            scoreEntered: currentValue.scoreEntered,
            scoreCalculated: currentValue.scoreCalculated
          }] as ScoreDataTableDetail[];
          return previousValue;
        }, {} as { [key: number]: ScoreTableData });
        return Object.values(scoreMap);
      }),
      tap((response) => {
        this.displayColumns = response[0]?.scoreArray.map(x => x.categoryName);
        this.scoreDetailData = response;
        this.totalCountData = response.length;
      }),
      delay(800),
      finalize(() => this.loadingService.hideLoading()),
      takeUntil(this.destroyed$)
    ).subscribe(() => console.log('fetch data score employees successful'));
  }
}
