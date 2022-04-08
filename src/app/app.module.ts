import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { FlowModule } from './modules/flow/flow.module';
import { SystemModule } from './modules/system/system.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NavbarComponent } from './common/navbar/navbar.component';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';
import { EntityStoreModule } from './data/entity-store.module';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageNotFoundComponent,
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
    EntityStoreModule,
    environment.production ? [] : StoreDevtoolsModule.instrument(),
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
export class AppModule {
}
