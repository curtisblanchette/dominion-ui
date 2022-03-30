import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRouting } from './login.routing';
import { LoginService } from './services/login.service';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';

@NgModule({
  imports: [
    LoginRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FiizUIModule
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
