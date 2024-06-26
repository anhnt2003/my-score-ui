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
  public horizontalOptions = ChartOptions;
  public user = this.authService.getAuthState() ?? 0;
  // public departmentId = this.departmentService.getDepartmentnState().id ?? 0;

  constructor(
    private readonly departmentService: DepartmentService,
    private readonly employeeService: EmployeeService,
    private authService: AuthService,
    private readonly scoreService: ScoreService
  ) {
    super();
   }
  
  ngOnInit(): void {
    this.initEmployeeInfo();
    this.initChartData();
  }

  private initChartData() {
    this.scoreService.getListScore({
      userId: 0,
      departmentId: 1
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

  private initEmployeeInfo() {
    this.employeeInfoData$ = this.employeeService.getEmployeeById(this.user.userId ?? 0);
  }
}
