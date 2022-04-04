import { NgModule } from '@angular/core';
import { FlowComponent } from "./flow.component";
import { FlowService } from "./flow.service";
import { FlowRouting } from "./flow.routing";
import { DataComponent, TextComponent } from "./components";
import { CommonModule } from "@angular/common";
import { IntroComponent } from "./components/intro.component";

@NgModule({
  declarations: [
    FlowComponent,
    IntroComponent,
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
