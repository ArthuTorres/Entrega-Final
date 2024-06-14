import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../_shared/shared.module';
import { FileManagerModule, InputsModule, QuickFormsModule } from '@gimmeapps/gquicklib-angular';
import { BuscadorServicosComponent } from './buscador-servicos/buscador-servicos.component';
import { GeradorPropostaComponent } from './gerador-proposta/gerador-proposta.component';
import { AvaliacaoClienteComponent } from './gerador-proposta/avaliacao-cliente/avaliacao-cliente.component';

export const routes: Routes = [
  { path: "buscar-servicos", component: BuscadorServicosComponent },
  { path: "elaborar-proposta/:idSolicitacao", component: GeradorPropostaComponent }
]

@NgModule({
  declarations: [
    BuscadorServicosComponent,
    GeradorPropostaComponent,
    AvaliacaoClienteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FileManagerModule,
    InputsModule,
    QuickFormsModule
  ],
  exports: [
    RouterModule
  ]
})
export class PrestadoresModule { }
