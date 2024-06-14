import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingPageComponent } from './pages/onboarding-page/onboarding-page.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { AuthGuard } from '../_shared/guards/auth.guard';
import { HasAuthGuard } from '../_shared/guards/has-auth.guard';

const routes: Routes = [
  { path: "", component: OnboardingPageComponent, canActivate: [HasAuthGuard] },
  { path: "perfil", component: PerfilPageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastroClienteRoutingModule { }
