import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: "perfil", loadChildren: () => import('./modules/perfil/perfil.module').then(m => m.PerfilModule) },
  { path: "auth", loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: "cadastro-cliente", loadChildren: () => import('./modules/cadastro-cliente/cadastro-cliente.module').then(m => m.CadastroClienteModule) },
  { path: "cadastro-prestador-servico", loadChildren: () => import('./modules/cadastro-prestador-servico/cadastro-prestador-servico.module').then(m => m.CadastroPrestadorServicoModule) },
  { path: "clientes", loadChildren: () => import('./modules/clientes/clientes.module').then(m => m.ClientesModule) },
  { path: "prestadores", loadChildren: () => import('./modules/prestadores/prestadores.module').then(m => m.PrestadoresModule) },
  { path: "mensagens", loadChildren: () => import('./modules/messaging/messaging.module').then(m => m.MessagingModule) },
  { path: "**", pathMatch: "full", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
