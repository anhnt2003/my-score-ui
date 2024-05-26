import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-app-nav',
  standalone: true,
  imports: [MenuModule, CommonModule],
  templateUrl: './app-nav.component.html',
  styleUrl: './app-nav.component.scss'
})
export class AppNavComponent implements OnInit {
  
  public items: MenuItem[] | undefined;
  constructor(private router: Router) {

  }
  ngOnInit(): void {
    this.items = [
      {
          label: 'MyScore',
          items: [
              {
                  label: 'Over View',
                  icon: 'fa fa-home',
                  command: () => {
                    this.router.navigate(['/dashboard']);
                  }
              },
              {
                  label: 'User',
                  icon: 'fa fa-user', 
                  command: () => {
                    this.router.navigate(['/user-organization']);
                  }
              },
              {
                label: 'Add Category',
                icon: 'fa fa-user', 
                command: () => {
                  this.router.navigate(['/category']);
                }
            }
          ]
      }
  ];
  }

}
