import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './interceptors/JwtInterceptor.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QuickFormsModule, UiModule } from '@gimmeapps/gquicklib-angular';
import { LogoComponent } from './components/logo/logo.component';
import { RouterModule } from '@angular/router';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule as QuickSharedModule } from '@gimmeapps/gquicklib-angular';
import { HeaderComponent } from './components/header/header.component'

@NgModule({
  declarations: [
    LogoComponent,
    NotificationsComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxSpinnerModule,
    UiModule,
    QuickFormsModule,
    RouterModule,
    FontAwesomeModule,
    QuickSharedModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    NgxSpinnerModule,
    UiModule,
    QuickFormsModule,
    LogoComponent,
    NotificationsComponent,
    HeaderComponent,
    FontAwesomeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
