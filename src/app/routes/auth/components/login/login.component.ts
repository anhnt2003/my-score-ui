import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

import { BaseComponent } from '../../../../core/components/base.component';
import { AuthService } from '../../../../data/services/auth.service';
import { switchMap, tap } from 'rxjs';
import { AuthResponseDto } from '../../../../data/types/auth-response.dto';

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
    private socialAuthService: SocialAuthService,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.socialAuthService.authState.pipe(
      switchMap((userInfor) => {
        return this.authService.verifyExternalLogin(userInfor).pipe(
          tap((res: AuthResponseDto) => {
            console.log(res);
            
          })
        )
      })
    )
    .subscribe();
  }
}
