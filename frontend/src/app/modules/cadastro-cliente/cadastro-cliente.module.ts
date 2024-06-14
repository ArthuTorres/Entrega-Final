import { NgModule } from '@angular/core';

import { CadastroClienteRoutingModule } from './cadastro-cliente-routing.module';
import { OnboardingPageComponent } from './pages/onboarding-page/onboarding-page.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { SharedModule } from '../_shared/shared.module';


@NgModule({
  declarations: [
    OnboardingPageComponent,
    PerfilPageComponent
  ],
  imports: [
    SharedModule,
    CadastroClienteRoutingModule
  ]
})
export class CadastroClienteModule { }
