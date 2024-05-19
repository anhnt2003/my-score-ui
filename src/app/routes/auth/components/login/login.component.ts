import { Component, OnInit } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from '../../../../core/components/base.component';
import { GoogleLoginProvider, SocialAuthService, GoogleSigninButtonModule  } from '@abacritt/angularx-social-login';
import { switchMap, tap } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthResponseDto } from '../../../../core/data/dto/auth-responseDto.dto';

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
