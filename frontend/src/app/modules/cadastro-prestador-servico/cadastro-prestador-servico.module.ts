import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadastroPrestadorServicoRoutingModule } from './cadastro-prestador-servico-routing.module';
import { OnboardingPageComponent } from './pages/onboarding-page/onboarding-page.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { SharedModule } from '../_shared/shared.module';


@NgModule({
  declarations: [
    OnboardingPageComponent,
    PerfilPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CadastroPrestadorServicoRoutingModule
  ]
})
export class CadastroPrestadorServicoModule { }
