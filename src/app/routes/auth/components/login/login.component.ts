import {
  Component,
  OnInit,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

import { BaseComponent } from '../../../../core/components/base.component';
import { AuthResponseDto } from '../../../../data/types/auth-response.dto';
import { filter, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../../../data/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    ToastModule,
    RouterModule,
    GoogleSigninButtonModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit{

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.pipe(
      filter((isAuthenticated) => isAuthenticated),
      tap(() => this.router.navigate([''])),
      takeUntil(this.destroyed$)
    ).subscribe();
  }
}
