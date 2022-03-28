import { NgModule } from '@angular/core';
import { FlowComponent } from "./flow.component";
import { TextComponent } from "./components/text.component";
import { FlowDirective } from "./common";
import { FlowService } from "./flow.service";
import { FlowRouting } from "./flow.routing";
import { DataComponent } from "./components/data.component";
import { CommonModule } from "@angular/common";


@NgModule({
  declarations: [
    FlowDirective,
    FlowComponent,
    TextComponent,
    DataComponent
  ],
  imports: [
    FlowRouting,
    CommonModule
  ],
  providers: [
    FlowService
  ]
})
export class FlowModule { }
