import { NgModule } from '@angular/core';
import { FlowComponent } from "./flow.component";
import { FlowService } from "./flow.service";
import { FlowRouting } from "./flow.routing";
import { FlowTextComponent } from "./_core/step-components";
import { CommonModule } from "@angular/common";
import { FlowIntroComponent } from "./_core/step-components/intro/flow-intro.component";
import { FiizUIModule } from "../../common/components/ui/fiiz-ui.module";
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/flow.reducer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FlowNotesComponent, FlowTimelineComponent } from './_core/layout-components';
import { EffectsModule } from '@ngrx/effects';
import { FlowEffects } from './store/flow.effects';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlowDataComponent } from './_core/step-components/data/flow-data.component';
import { FlowListComponent } from './_core/step-components/list/flow-list.component';

@NgModule({
  declarations: [
    FlowComponent,
    FlowNotesComponent,
    FlowTimelineComponent,
    FlowIntroComponent,
    FlowTextComponent,
    FlowDataComponent,
    FlowListComponent
  ],
  imports: [
    StoreModule.forFeature('flow', reducer),
    EffectsModule.forFeature([FlowEffects]),
    FlowRouting,
    CommonModule,
    FiizUIModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [
    FlowService
  ]
})
export class FlowModule {}
