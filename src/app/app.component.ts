import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InputGroupModule, InputGroupAddonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-score-ui';
}
