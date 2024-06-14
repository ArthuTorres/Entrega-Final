import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HasAuthGuard } from '../_shared/guards/has-auth.guard';

const routes: Routes = [
  { "path": "login", component: LoginPageComponent, canActivate: [HasAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
