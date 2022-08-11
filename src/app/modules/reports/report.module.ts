import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsComponent } from './reports.component';
import { ReportsRouting } from './reports.routing';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRouting,
    FiizUIModule
  ]
})
export class ReportsModule {
}
