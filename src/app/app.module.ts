import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
import { LoginModule } from './modules/login/login.module';
import { reducer, effects } from './reducers.index';
import { CustomHttpInterceptor } from './common/interceptor/CustomHttpInterceptor.interceptor';
import { FlowModule } from "./modules/flow/flow.module";
import { SystemModule } from "./modules/system/system.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LoginModule,
    SharedModule,
    HttpClientModule,
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot(effects),
    DashboardModule,
    FlowModule,
    SystemModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
