import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SystemComponent } from "./system.component";
import { SystemRouting } from "./system.routing";

@NgModule({
  declarations: [
    SystemComponent
  ],
  imports: [
    SystemRouting,
    CommonModule
  ],
  providers: [

  ]
})
export class SystemModule { }
