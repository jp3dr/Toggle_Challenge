import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BetComponent } from './screens/bet/bet.component';
import { Login } from './screens/login/login.component';


export const routesNames = {
  BET: '/',
  DEFAULT:'/',
  LOGIN: 'login'
}

const routes: Routes = [
  {
    path:'',
    component: BetComponent
  },
  {
    path: 'login',
    component: Login
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
