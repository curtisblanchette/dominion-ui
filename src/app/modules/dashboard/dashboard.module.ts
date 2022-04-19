import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRouting } from "./dashboard.routing";
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';


@NgModule({
  imports: [
    DashboardRouting,
    CommonModule,
    FiizUIModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
  ]
})
export class DashboardModule { }
