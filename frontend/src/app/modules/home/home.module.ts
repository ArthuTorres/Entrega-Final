import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SharedModule } from '../_shared/shared.module';
import { DashboardServicosClienteComponent } from './pages/home-page/dashboard-servicos-cliente/dashboard-servicos-cliente.component';
import { DashboardServicosPrestadorComponent } from './pages/home-page/dashboard-servicos-prestador/dashboard-servicos-prestador.component';
import { DashboardPropostasPrestadorComponent } from './pages/home-page/dashboard-propostas-prestador/dashboard-propostas-prestador.component';
import { UiModule } from '@gimmeapps/gquicklib-angular';


@NgModule({
  declarations: [
    HomePageComponent,
    DashboardServicosClienteComponent,
    DashboardServicosPrestadorComponent,
    DashboardPropostasPrestadorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    UiModule
  ]
})
export class HomeModule { }
