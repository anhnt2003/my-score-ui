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
import { ChartData } from 'chart.js';
import { ChartOptions } from '../../../../shared/common/constants';
import { AuthService } from '../../../../data/services/auth.service';
import { DepartmentService } from '../../../../data/services/department.service';
import { EmployeeDto } from '../../../../data/types/employee.dto';
import { EmployeeService } from '../../../../data/services/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements OnInit {
  public chartData: ChartData | undefined;
  public employeeInfoData$ = new Observable<EmployeeDto>();
  public radarOptions = ChartOptions;
  public user = this.authService.getAuthState() ?? 0;
  public departmentId = this.departmentService.getDepartmentnState().id ?? 0;

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly employeeService: EmployeeService,
    private authService: AuthService,
    private readonly scoreService: ScoreService
  ) {
    super();
   }

   data: any;

   options: any;
  
  ngOnInit(): void {
    this.initEmployeeInfo();
    this.initChartData();
  }

  private initChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    
    this.scoreService.getListScore({
      userId: this.user.userId!,
      departmentId: this.departmentId,
      isReview: false
    }).pipe(
      map((dataScore) => dataScore.filter((item) => item.parentId == null)),
      tap(data => {
        this.chartData = {
          labels: [...data.map((item) => item.categoryName)],
          datasets: [
            {
              label: 'Skill',
              borderColor: 'black',
              pointBackgroundColor: 'red',
              pointBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
              pointHoverBackgroundColor: textColor,
              pointHoverBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
              data: [...data.map((item) => item.scoreCalculated)]
            },
          ]
        };
      }),
      takeUntil(this.destroyed$)
    ).subscribe();
  }

  private initEmployeeInfo() {
    this.employeeInfoData$ = this.employeeService.getEmployeeById(this.user.userId ?? 0);
  }
}
