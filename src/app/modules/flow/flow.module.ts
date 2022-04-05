import { NgModule } from '@angular/core';
import { FlowComponent } from "./flow.component";
import { FlowService } from "./flow.service";
import { FlowRouting } from "./flow.routing";
import { DataComponent, TextComponent } from "./components";
import { CommonModule } from "@angular/common";
import { IntroComponent } from "./components/intro.component";
import { FiizUIModule } from "../../common/components/ui/fiiz-ui.module";
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/flow.reducer';
import { entityConfig } from './store/data/entity-metadata';
import { EntityDataModule } from '@ngrx/data';
import { EntityStoreModule } from './store/data/entity-store.module';

@NgModule({
  declarations: [
    FlowComponent,
    IntroComponent,
    TextComponent,
    DataComponent
  ],
  imports: [
    StoreModule.forFeature('flow', reducer),
    EntityDataModule.forRoot(entityConfig),
    EntityStoreModule,
    FlowRouting,
    CommonModule,
    FiizUIModule,
    FormsModule
  ],
  providers: [
    FlowService
  ]
})
export class FlowModule { }
