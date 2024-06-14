import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagingRoutingModule } from './messaging-routing.module';
import { MessagesPageComponent } from './messages-page/messages-page.component';
import { SharedModule } from '../_shared/shared.module';
import { SharedModule as QuickSharedModule } from '@gimmeapps/gquicklib-angular'


@NgModule({
  declarations: [
    MessagesPageComponent
  ],
  imports: [
    CommonModule,
    MessagingRoutingModule,
    SharedModule,
    QuickSharedModule
  ]
})
export class MessagingModule { }
