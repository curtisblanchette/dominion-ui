import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DataComponent } from './data.component';
import { SidebarComponent } from './_core/components/sidebar/sidebar.component';
import { LeadComponent } from './_core/components/lead/lead.component';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { DataRouting } from './data.routing';

@NgModule({
    declarations: [
        DataComponent,
        SidebarComponent,
        LeadComponent
    ],
    imports: [
        CommonModule,
        FiizUIModule,
        DataRouting
    ],
    providers: [
      
    ]
  })
  export class DataModule {}