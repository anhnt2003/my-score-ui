import { Component } from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../data/services/auth.service';
import { BaseComponent } from '../../core/components/base.component';
import { catchError, of, takeUntil } from 'rxjs';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { LOCAL_STORAGE_AUTH_KEY } from '../../core/common/constants';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [OverlayPanelModule, ButtonModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent extends BaseComponent {

  constructor(
    public authService: AuthService
  ) {
    super();
  }

  public logOut() {
    this.authService.logOut();
    location.reload();
  }
}
