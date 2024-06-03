import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import {
  map,
  Observable,
  takeUntil,
  tap,
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { ScoreService } from '../../../../data/services/score.service';
import { UserService } from '../../../../data/services/user.service';
import {
  OrganizationUserDto,
} from '../../../../data/types/organization-user.dto';
import { ChartData } from 'chart.js';
import { ChartOptions } from '../../../../shared/common/constants';
import { OrganizationService } from '../../../../data/services/organization.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements OnInit {
  public chartData: ChartData | undefined;
  public userOrganizationProfileData$ = new Observable<OrganizationUserDto>();
  public horizontalOptions = ChartOptions;

  constructor(
    private readonly organizationService: OrganizationService,
    private readonly scoreService: ScoreService
  ) {
    super();
   }
  
  ngOnInit(): void {
    this.initProfileUser();
    this.initChartData();
  }

  private initChartData() {
    this.scoreService.getListScore({
      userId: 1,
      organizationId: 1
    }).pipe(
      map((dataScore) => dataScore.filter((item) => item.parentId == null)),
      tap(data => {
        this.chartData = {
          labels: [...data.map((item) => item.categoryName)],
          datasets: [
            {
              label: 'Booked',
              backgroundColor: 'green',
              data: [...data.map((item) => item.scoreCalculated)]
            },
          ]
        }
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  private initProfileUser() {
    this.userOrganizationProfileData$ = this.organizationService.getPagedOrganizationUser({ userId: 1, organizationId: 1, take: 1, skip: 0 }).pipe(
      map((response) => response.data[0])
    );
  }
}
