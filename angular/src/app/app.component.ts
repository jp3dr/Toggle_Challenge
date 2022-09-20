import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routesNames } from './app-routing.module';
import { AuthService } from './repository/authRepository';
import { Alerts } from './shared/alerts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'toggleTest';
  
}
