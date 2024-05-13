import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppFooterComponent } from '../app-footer/app-footer.component';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { AppNavComponent } from '../app-nav/app-nav.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [AppHeaderComponent, AppFooterComponent, AppNavComponent, RouterOutlet, CommonModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

}
