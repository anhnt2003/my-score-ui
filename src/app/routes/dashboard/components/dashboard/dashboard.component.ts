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
import { AuthService } from '../../../../data/services/auth.service';

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
  public userId = this.authService.getAuthState().userId ?? 0;
  public organizationId = this.organizationService.getOrganizationState().id ?? 0;

  constructor(
    private readonly organizationService: OrganizationService,
    private authService: AuthService,
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
      userId: this.userId,
      organizationId: this.organizationId
    }).pipe(
      map((dataScore) => dataScore.filter((item) => item.parentId == null)),
      tap(data => {
        this.chartData = {
          labels: [...data.map((item) => item.categoryName)],
          datasets: [
            {
              label: 'Skill',
              backgroundColor: 'green',
              data: [...data.map((item) => item.scoreCalculated)]
            },
          ]
        };
        console.log(this.chartData.datasets)
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  private initProfileUser() {
    this.userOrganizationProfileData$ = this.organizationService.getPagedOrganizationUser({ userId: this.userId, organizationId: this.organizationId, take: 10, skip: 0 }).pipe(
      map((response) => response.data[0])
    );
  }
}
