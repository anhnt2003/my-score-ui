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
} from 'rxjs';

import { BaseComponent } from '../../../../core/components/base.component';
import { horizontalOptions } from '../../../../core/components/common/constant';
import { ScoreService } from '../../../../data/services/score.service';
import { UserService } from '../../../../data/services/user.service';
import {
  OrganizationUserDto,
} from '../../../../data/types/organization-user.dto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, CommonModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements OnInit {
  public data: any;
  public chartOption = horizontalOptions;
  public userOrganizationProfileData$ = new Observable<OrganizationUserDto>();

  constructor(
    private readonly userService: UserService,
    private readonly scoreService: ScoreService
  ) {
    super();
   }
  
  ngOnInit(): void {
    this.userOrganizationProfileData$ = this.userService.getUserById({
      userId: 2,
      organizationId: 1
    });

  this.scoreService.getListScore({
      userId: 1,
      organizationId: 1
    }).pipe(
      map(data => {
        this.data = { 
          labels: [...data.map(item => item.categoryName)],
          datasets: [ 
              { 
                  label: 'Booked', 
                  backgroundColor: 'green', 
                  data: [4.15], 
              }, 
          ] 
      }; 
      })
    ).subscribe();
  }
}
