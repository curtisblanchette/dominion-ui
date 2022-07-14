import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from "./settings.component";
import { SettingsRouting } from "./settings.routing";
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    SettingsRouting,
    FiizUIModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [

  ]
})
export class SettingsModule { }
