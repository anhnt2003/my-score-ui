import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { PaginatorState } from 'primeng/paginator';
import {
  map,
  merge,
  Subject,
  takeUntil,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { AuthService } from '../../../../data/services/auth.service';
import {
  DepartmentService,
} from '../../../../data/services/department.service';
import { ScoreService } from '../../../../data/services/score.service';
import { ScoreTableData } from '../../../../data/types/score-data-table';
import { DefaultPagingOptions } from '../../../../shared/common/constants';
import { SharedModule } from '../../../../shared/module/shared.module';
import { EmployeeService } from '../../../../data/services/employee.service';

@Component({
  selector: 'app-score-detail',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './score-detail.component.html',
  styleUrl: './score-detail.component.scss'
})
export class ScoreDetailComponent extends BaseComponent implements OnInit, AfterViewInit {

  public scoreDetailData: ScoreTableData[] = [];
  public pagingOptions = DefaultPagingOptions;
  public totalCountData: number = 0;
  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();
  public userId = this.authService.getAuthState().userId ?? 0;
  public departmentId = this.departmentService.getDepartmentnState().id ?? 0;

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl: ElementRef | undefined;
  @ViewChild('paginator') paginator: PaginatorState | undefined;

  constructor(
    private readonly scoreService: ScoreService,
    private readonly departmentService: DepartmentService,
    private readonly employeeService: EmployeeService,
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedScoreEmployee(this.departmentId);
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedScoreEmployee(this.departmentId);
    });
  }

  private loadPagedScoreEmployee(departmentId: number, pageIndex = 0, pageSize = DefaultPagingOptions.pageSize, searchTerm?: string) {
    this.scoreService.getPagedScore({
      departmentId: departmentId,
      take: pageSize,
      skip: pageIndex * pageSize,
      searchTerm: searchTerm
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
            categoryName: currentValue.categoryName,
            categoryId: currentValue.categoryId,
            scoreCalculated: currentValue.scoreCalculated
          }];
          return previousValue;
        }, {} as { [key: number]: ScoreTableData });
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
}
