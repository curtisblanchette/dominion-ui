import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRouting } from './login.routing';
import { LoginService } from './services/login.service';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/login.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LoginEffects } from './store/login.effects';

@NgModule({
  imports: [
    LoginRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FiizUIModule,
    StoreModule.forFeature('login', reducer),
    EffectsModule.forFeature([LoginEffects])
  ],
  declarations: [
    LoginComponent,
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule {
}
