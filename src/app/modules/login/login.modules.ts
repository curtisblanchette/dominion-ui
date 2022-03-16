import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { routing } from './login.routing';
import { LoginService } from './services/login.service';
// import { FooterModule } from '../../common/footer/footer.module';
// import { DirectivesModule } from '../../common/directives/directives.module';
// import { ReportsModule } from '../reports/reports.module';
// import { SharedModule } from '../shared/shared.module';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';

@NgModule({
  imports: [
    routing,
    CommonModule,
    // ReportsModule,
    // TranslateModule,
    // SharedModule,
    // FooterModule,
    FormsModule,
    ReactiveFormsModule,
    // DirectivesModule,
    FiizUIModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule {
}