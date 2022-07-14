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

import { CustomHttpInterceptor } from './common/interceptors/CustomHttpInterceptor.interceptor';
import { FlowModule } from './modules/flow/flow.module';
import { SystemModule } from './modules/system/system.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NavbarComponent } from './common/components/ui/navbar/navbar.component';
import { PageNotFoundComponent } from './common/components/page-not-found/page-not-found.component';
import { EntityStoreModule } from './data/entity-store.module';
import { reducer } from './store/app.reducer';
import { AppEffects } from './store/app.effects';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './common/interceptors/Error.interceptor';
import { DataModule } from './modules/data/data.module';
import { OutcomeFormModule } from './modules/outcome-form/outcome-form.module';

import { MetaReducer } from "@ngrx/store";
import { hydrationMetaReducer } from './store/hydration.reducer';
import { FlowService } from './modules/flow/flow.service';

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];

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
    StoreModule.forRoot({
      app: reducer
    }, {
      metaReducers,
      runtimeChecks: {
        // strictStateSerializability: true,
        // strictActionSerializability: true,
        strictStateImmutability: false,
        strictActionImmutability: false,
      }
    }),
    EffectsModule.forRoot([
      AppEffects
    ]),
    EntityStoreModule,
    environment.production ? [] : StoreDevtoolsModule.instrument(),
    DashboardModule,
    FlowModule,
    SystemModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    DataModule,
    OutcomeFormModule
  ],
  providers: [
    FlowService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
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
