import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DataComponent } from './data.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { DataRouting } from './data.routing';

@NgModule({
    declarations: [
        DataComponent,
        SidebarComponent
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
