import { Component } from '@angular/core';

import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
