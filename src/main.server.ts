import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import 'localstorage-polyfill';

const bootstrap = () => bootstrapApplication(AppComponent, config);

global['localStorage'] = localStorage; // không biết sao lại chạy đc nên để tạm

export default bootstrap;
