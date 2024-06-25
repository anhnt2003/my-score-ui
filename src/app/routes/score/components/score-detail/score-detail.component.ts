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
import { ScoreDto } from '../../../../data/types/score.dto';
import { DefaultPagingOptions } from '../../../../shared/common/constants';

@Component({
  selector: 'app-score-detail',
  standalone: true,
  imports: [TableModule, IconFieldModule, InputIconModule, PaginatorModule],
  templateUrl: './score-detail.component.html',
  styleUrl: './score-detail.component.scss'
})
export class ScoreDetailComponent extends BaseComponent implements OnInit, AfterViewInit {

  public scoreDetailData: ScoreDto[] = [];
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
    private authService: AuthService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedScoreEmployee(this.departmentId, undefined);
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedScoreEmployee(this.departmentId, 1);
    });
  }

  private loadPagedScoreEmployee(departmentId: number, pageIndex = 0, pageSize = DefaultPagingOptions.pageSize , searchTerm?: string) {
    this.scoreService.getPagedScore({
      departmentId: departmentId,
      take: pageSize,
      skip: pageIndex * pageSize,
      searchTerm: searchTerm
    }).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((response) => {
      this.scoreDetailData = response.data;
      this.totalCountData = response.total;
      console.log('fetch data score employees successful');
    });
  }
}
