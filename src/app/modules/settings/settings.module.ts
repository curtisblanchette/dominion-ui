import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SettingsComponent } from "./settings.component";
import { SettingsRouting } from "./settings.routing";

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    SettingsRouting,
    CommonModule
  ],
  providers: [

  ]
})
export class SettingsModule { }
