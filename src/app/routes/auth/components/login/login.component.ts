import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

import { BaseComponent } from '../../../../core/components/base.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    ToastModule,
    RouterModule,
    GoogleSigninButtonModule
  ],
  providers: [
    MessageService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit{

  constructor(
  ) {
    super();
  }

  ngOnInit(): void {
  }
}
