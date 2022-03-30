import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRouting } from "./dashboard.routing";


@NgModule({
  imports: [
    DashboardRouting,
    CommonModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
  ]
})
export class DashboardModule { }
