import { Component, OnInit } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { DefaultPagingOptions } from '../../../../shared/common/constants';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { BaseComponent } from '../../../../core/components/base.component';

@Component({
  selector: 'app-score-detail',
  standalone: true,
  imports: [TableModule, IconFieldModule, InputIconModule, PaginatorModule],
  templateUrl: './score-detail.component.html',
  styleUrl: './score-detail.component.scss'
})
export class ScoreDetailComponent extends BaseComponent implements OnInit {

  public scoreDetailData: any[] = []
  public pagingOptions = DefaultPagingOptions
  public paginatorSubject = new Subject<PaginatorState>();

  private paginatorChanged$ = this.paginatorSubject.asObservable();

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
