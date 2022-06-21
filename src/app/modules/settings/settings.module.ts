import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SettingsComponent } from "./settings.component";
import { SettingsRouting } from "./settings.routing";
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    SettingsRouting,
    FiizUIModule,
    CommonModule
  ],
  providers: [

  ]
})
export class SettingsModule { }
