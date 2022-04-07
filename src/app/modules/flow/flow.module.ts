import { NgModule } from '@angular/core';
import { FlowComponent } from "./flow.component";
import { FlowService } from "./flow.service";
import { FlowRouting } from "./flow.routing";
import { DataComponent, TextComponent, ListComponent } from "./components";
import { CommonModule } from "@angular/common";
import { IntroComponent } from "./components/intro.component";
import { FiizUIModule } from "../../common/components/ui/fiiz-ui.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    FlowComponent,
    IntroComponent,
    TextComponent,
    DataComponent,
    ListComponent
  ],
  imports: [
    FlowRouting,
    CommonModule,
    FiizUIModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [
    FlowService
  ]
})
export class FlowModule { }
