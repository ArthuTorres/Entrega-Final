import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';
import { SharedModule } from '../_shared/shared.module';
import { QuickFormsModule } from '@gimmeapps/gquicklib-angular';


@NgModule({
  declarations: [
    PerfilPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PerfilRoutingModule,
    QuickFormsModule
  ]
})
export class PerfilModule { }
