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
import { ScoreService } from '../../../../data/services/score.service';
import { ScoreUserDto } from '../../../../data/types/score-user.dto';
import { DefaultPagingOptions } from '../../../../shared/common/constants';

@Component({
  selector: 'app-score-detail',
  standalone: true,
  imports: [TableModule, IconFieldModule, InputIconModule, PaginatorModule],
  templateUrl: './score-detail.component.html',
  styleUrl: './score-detail.component.scss'
})
export class ScoreDetailComponent extends BaseComponent implements OnInit, AfterViewInit {

  public scoreDetailData: ScoreUserDto[] = [];
  public pagingOptions = DefaultPagingOptions;
  public totalCountData: number = 0;
  public searchTermSubject = new Subject<string>();
  public paginatorSubject = new Subject<void>();

  private paginatorChanged$ = this.paginatorSubject.asObservable();
  private searchTermChanged$ = this.searchTermSubject.asObservable();

  @ViewChild('searchTerm') searchTermEl: ElementRef | undefined;
  @ViewChild('paginator') paginator: PaginatorState | undefined;

  constructor(private readonly scoreService: ScoreService) {
    super();
  }

  ngOnInit(): void {
    this.loadPagedScoreUser(1);
  }

  ngAfterViewInit(): void {
    merge(this.searchTermChanged$, this.paginatorChanged$).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.loadPagedScoreUser(1)
    });
  }

  private loadPagedScoreUser(organizationId: number) {
    this.scoreService.getPagedScore(organizationId).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((response) => {
      this.scoreDetailData = response.data;
      this.totalCountData = response.total;
      console.log('fetch data score user successful');
    });
  }
}
